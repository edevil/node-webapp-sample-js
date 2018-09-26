import * as Router from "koa-router";
import { logger } from "logger";

export const router = new Router();

router.get("index", "/", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.debug("Authenticated request");
  } else {
    logger.debug("No authentication");
  }
  await ctx.render('user')
  // ctx.body = "Hello world";
});
