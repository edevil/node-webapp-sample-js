const { getMessages } = require("../messages");

const getMessagesMW = () => async (ctx, next) => {
  ctx.state.messages = getMessages(ctx);
  await next();
};

module.exports = {
  getMessagesMW,
};
