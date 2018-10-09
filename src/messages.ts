import { Context } from "koa";

enum Level {
  Info,
  Success,
  Warning,
  Error,
}

function addMessage(level: Level, ctx: Context, message: string): void {
  ctx.session.messages = ctx.session.messages || [];
  ctx.session.messages.push({ level: level, message: message });
}

export const addInfo = addMessage.bind(null, Level.Info);
export const addSuccess = addMessage.bind(null, Level.Success);
export const addWarning = addMessage.bind(null, Level.Warning);
export const addError = addMessage.bind(null, Level.Error);

export function getMessages(ctx: Context): object[] {
  const messages = ctx.session.messages || [];
  delete ctx.session.messages;
  return messages;
}
