import * as Router from "koa-router";
import { logger } from "@app/logger";
import * as CSRF from "koa-csrf";
import { transformAndValidate } from "class-transformer-validator";
import { CreateUser } from "@app/dtos/create-user";
import { createUser } from "@app/service";
import { getRepository, QueryFailedError } from "typeorm";
import { User } from "@app/entities/user";
import { getLoggedInMW, getLoginReqMW } from "@app/middleware/redirect-logged";
import * as passport from "koa-passport";
import { afterLogin } from "@app/utils";
import { getMessagesMW } from "@app/middleware/fetch-messages";
import * as bodyParser from "koa-bodyparser";

export const router = new Router();

const redLoggedMW = getLoggedInMW(router, "index");
const redLoginReqMW = getLoginReqMW(router, "auth-login");

router.use(bodyParser());

router.use(
  new CSRF({
    invalidSessionSecretMessage: "Invalid session secret",
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: "Invalid CSRF token",
    invalidTokenStatusCode: 403,
    excludedMethods: ["GET", "HEAD", "OPTIONS"],
    disableQuery: false,
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
    login_url: router.url("auth-logout-post"),
    csrf: ctx.csrf,
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
    login_url: router.url("auth-login-post"),
    csrf: ctx.csrf,
  });
});

router.post("auth-login-post", "/auth/login", redLoggedMW, async (ctx, next) => {
  const loginCallback = async (err, user, info, status) => {
    if (user) {
      await afterLogin(ctx, user, router);
    } else {
      logger.info("Could not login user", { err, info, status });
      await ctx.render("login", {
        login_url: router.url("auth-login-post"),
        csrf: ctx.csrf,
      });
    }
  };

  return passport.authenticate("local", loginCallback)(ctx, next);
});

router.get("auth-register", "/auth/register", redLoggedMW, async (ctx, next) => {
  await ctx.render("register", {
    register_url: router.url("auth-register-post"),
    csrf: ctx.csrf,
  });
});

router.post("auth-register-post", "/auth/register", redLoggedMW, async (ctx, next) => {
  let createReq: CreateUser;
  try {
    createReq = <CreateUser>await transformAndValidate(CreateUser, ctx.request.body);
  } catch (error) {
    logger.error(JSON.stringify(error));
    // TODO
    // return error to user
    // flash messages?
    await ctx.render("register", {
      register_url: router.url("auth-register-post"),
      csrf: ctx.csrf,
      error: error,
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
        register_url: router.url("auth-register-post"),
        csrf: ctx.csrf,
        error: error,
      });
      return;
    }
  }
  logger.info("New user created", { userId: user.id });
  await afterLogin(ctx, user, router);
});
