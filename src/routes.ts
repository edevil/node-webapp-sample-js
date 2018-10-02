import * as Router from "koa-router";
import { logger } from "logger";
import * as CSRF from "koa-csrf";
import * as KoaBody from "koa-body";
import { transformAndValidate } from "class-transformer-validator";
import { CreateUser } from "dtos/create-user";
import { createUser } from "service";
import { getRepository, QueryFailedError } from "typeorm";
import { User } from "entities/user";
import { getLoggedINMid } from "./middleware/redirect-logged";
import * as passport from "koa-passport";

export const router = new Router();

const redLoggedMW = getLoggedINMid(router, "index");

router.use(KoaBody({ multipart: true }));

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

router.get("index", "/", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.debug("Authenticated request");
  } else {
    logger.debug("No authentication");
  }
  await ctx.render("index", { authenticated: ctx.isAuthenticated() });
});

router.get("auth-logout", "/auth/logout", async (ctx, next) => {
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

router.get("auth-login", "/auth/login", redLoggedMW, async (ctx, next) => {
  await ctx.render("login", {
    login_url: router.url("auth-login-post"),
    csrf: ctx.csrf,
  });
});

router.post("auth-login-post", "/auth/login", redLoggedMW, async (ctx, next) => {
  const authCallback = async (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.redirect(router.url("index"));
    } else {
      logger.info("Could not login user");
      await ctx.render("login", {
        login_url: router.url("auth-login-post"),
        csrf: ctx.csrf,
      });
    }
  };

  return passport.authenticate("local", authCallback)(ctx, next);
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
      logger.debug("Username already exists", { username: createReq.username });
      await ctx.render("register", {
        register_url: router.url("auth-register-post"),
        csrf: ctx.csrf,
        error: error,
      });
      return;
    }
  }
  logger.info("New user created", { userId: user.id });
  await ctx.login(user);
  ctx.redirect(router.url("auth-register"));
});
