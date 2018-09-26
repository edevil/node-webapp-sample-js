import * as Router from "koa-router";
import { logger } from "logger";

export const router = new Router();

router.get("index", "/", (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.debug("Authenticated request");
  } else {
    logger.debug("No authentication");
  }
  ctx.body = "Hello world";
});
