import * as Router from "koa-router";
import { logger } from "logger";
import * as CSRF from "koa-csrf";
import * as KoaBody from "koa-body";

export const router = new Router();

router.use(KoaBody({ multipart: true })).use(
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
  console.log("TEST");
});
