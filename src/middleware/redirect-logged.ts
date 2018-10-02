import { logger } from "logger";

export const getLoggedINMid = (router, loggedRoute) => async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.info("User already logged in");
    ctx.redirect(router.url(loggedRoute));
    return;
  }

  await next();
};
