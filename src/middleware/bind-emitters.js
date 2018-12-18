const clsFactory = require("@emartech/cls-adapter");

const getBinderMW = () => async (ctx, next) => {
  ctx.state.requestId = clsFactory.getRequestId();
  await next();
};

module.exports = {
  getBinderMW,
};
