const { logger } = require("../logger");

const getLoggedInMW = (router, loggedRoute) => async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.info("User already logged in");
    ctx.redirect(router.url(loggedRoute));
    return;
  }

  await next();
};

const getLoginReqMW = (router, loginRoute) => async (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    logger.info("User not logged in", { url: ctx.originalUrl });
    ctx.session.nextUrl = ctx.originalUrl;
    ctx.redirect(router.url(loginRoute));
    return;
  }

  await next();
};

module.exports = {
  getLoggedInMW,
  getLoginReqMW,
};
