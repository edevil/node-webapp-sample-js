import { getRequestId } from "@emartech/cls-adapter";

export const getBinderMW = () => async (ctx, next) => {
  ctx.state.requestId = getRequestId();
  await next();
};
