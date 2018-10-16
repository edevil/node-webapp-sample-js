import { transformAndValidate } from "class-transformer-validator";
import * as bodyParser from "koa-bodyparser";
import * as CSRF from "koa-csrf";
import * as passport from "koa-passport";
import * as Router from "koa-router";
import { getRepository, QueryFailedError } from "typeorm";
import { CreateUser } from "./dtos/create-user";
import { User } from "./entities/user";
import { logger } from "./logger";
import { getMessagesMW } from "./middleware/fetch-messages";
import { getLoggedInMW, getLoginReqMW } from "./middleware/redirect-logged";
import { loginRLMW } from "./rate-limits";
import { createUser } from "./service";
import { afterLogin } from "./utils";

export const router = new Router();

const redLoggedMW = getLoggedInMW(router, "index");
const redLoginReqMW = getLoginReqMW(router, "auth-login");

router.use(bodyParser());

router.use(
  new CSRF({
    disableQuery: false,
    excludedMethods: ["GET", "HEAD", "OPTIONS"],
    invalidSessionSecretMessage: "Invalid session secret",
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: "Invalid CSRF token",
    invalidTokenStatusCode: 403,
  }),
);

router.use(getMessagesMW());

router.get("index", "/", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.debug("Authenticated request");
  } else {
    logger.debug("No authentication");
  }
  logger.debug("Locale", {
    cookie: ctx.getLocaleFromCookie(),
    header: ctx.getLocaleFromHeader(),
  });
  logger.debug("Translate", { result: ctx.i18n.__("test key") });

  await ctx.render("index", { authenticated: ctx.isAuthenticated() });
});

router.get("auth-logout", "/auth/logout", redLoginReqMW, async (ctx, next) => {
  await ctx.render("logout", {
    csrf: ctx.csrf,
    login_url: router.url("auth-logout-post"),
  });
});

router.post("auth-logout-post", "/auth/logout", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.info("Logging out");
    ctx.logout();
  } else {
    logger.debug("Logout with no auth");
  }

  ctx.redirect(router.url("index"));
});

router.get("auth-login-google", "/auth/google", redLoggedMW, async (ctx, next) => {
  return passport.authenticate("google", { scope: ["profile", "email"] })(ctx, next);
});

router.get("auth-login-google-callback", "/auth/google/callback", redLoggedMW, async (ctx, next) => {
  const loginCallback = async (err, user, info, status) => {
    if (user) {
      await afterLogin(ctx, user, router);
    } else {
      logger.info("Could not login user", { err: JSON.stringify(err), info, status });
      ctx.redirect(router.url("index"));
    }
  };

  return passport.authenticate("google", loginCallback)(ctx, next);
});

router.get("auth-login", "/auth/login", redLoggedMW, async (ctx, next) => {
  await ctx.render("login", {
    csrf: ctx.csrf,
    login_url: router.url("auth-login-post"),
  });
});

router.post("auth-login-post", "/auth/login", loginRLMW, redLoggedMW, async (ctx, next) => {
  const loginCallback = async (err, user, info, status) => {
    if (user) {
      await afterLogin(ctx, user, router);
    } else {
      logger.info("Could not login user", { err, info, status });
      await ctx.render("login", {
        csrf: ctx.csrf,
        login_url: router.url("auth-login-post"),
      });
    }
  };

  return passport.authenticate("local", loginCallback)(ctx, next);
});

router.get("auth-register", "/auth/register", redLoggedMW, async (ctx, next) => {
  await ctx.render("register", {
    csrf: ctx.csrf,
    register_url: router.url("auth-register-post"),
  });
});

router.post("auth-register-post", "/auth/register", redLoggedMW, async (ctx, next) => {
  let createReq: CreateUser;
  try {
    createReq = (await transformAndValidate(CreateUser, ctx.request.body)) as CreateUser;
  } catch (error) {
    logger.error(JSON.stringify(error));
    // TODO
    // return error to user
    // flash messages?
    await ctx.render("register", {
      csrf: ctx.csrf,
      error,
      register_url: router.url("auth-register-post"),
    });
    return;
  }

  let user;
  try {
    user = await createUser(createReq, getRepository(User));
  } catch (error) {
    if (error instanceof QueryFailedError) {
      logger.debug("User already registered", { email: createReq.email });
      await ctx.render("register", {
        csrf: ctx.csrf,
        error,
        register_url: router.url("auth-register-post"),
      });
      return;
    }
  }
  logger.info("New user created", { userId: user.id });
  await afterLogin(ctx, user, router);
});
