import * as Router from "koa-router";
import { logger } from "logger";
import * as CSRF from "koa-csrf";
import * as KoaBody from "koa-body";
import { transformAndValidate } from "class-transformer-validator";
import { CreateUser } from "dtos/create-user";

export const router = new Router();

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
  await ctx.render("user");
});

router.get("auth-register", "/auth/register", async (ctx, next) => {
  await ctx.render("register", {
    register_url: router.url("auth-register-post"),
    csrf: ctx.csrf,
  });
});

router.post("auth-register-post", "/auth/register", async (ctx, next) => {
  let createReq: CreateUser;
  try {
    createReq = <CreateUser>await transformAndValidate(CreateUser, ctx.request.body);
  } catch (error) {
    logger.error(JSON.stringify(error));
    // return error to user
    // flash messages?
    await ctx.render("register", {
      register_url: router.url("auth-register-post"),
      csrf: ctx.csrf,
      error: error,
    });
    return;
  }
  logger.info(createReq.username);
  ctx.redirect(router.url("auth-register"));
});
