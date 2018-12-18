const Level = {
  Info: "INFO",
  Success: "SUCCESS",
  Warning: "WARNING",
  Error: "ERROR",
};

function addMessage(level, ctx, message) {
  ctx.session.messages = ctx.session.messages || [];
  ctx.session.messages.push({ level, message });
}

const addInfo = addMessage.bind(null, Level.Info);
const addSuccess = addMessage.bind(null, Level.Success);
const addWarning = addMessage.bind(null, Level.Warning);
const addError = addMessage.bind(null, Level.Error);

function getMessages(ctx) {
  const messages = ctx.session.messages || [];
  delete ctx.session.messages;
  return messages;
}

module.exports = {
  addInfo,
  addSuccess,
  addWarning,
  addError,
  getMessages,
};
