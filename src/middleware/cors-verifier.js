const cors = require("@koa/cors");
const { config } = require("../config");

function whitelistOrigin(ctx) {
  const requestOrigin = ctx.accept.headers.origin;
  if (!config.origins.includes(requestOrigin)) {
    return ctx.throw(`${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
}

const getCORSMW = () => cors({ origin: whitelistOrigin, credentials: true });

module.exports = {
  getCORSMW,
};
