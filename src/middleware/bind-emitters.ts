import { createNamespace, getRequestId } from "@emartech/cls-adapter";

export const getBinderMW = () => async (ctx, next) => {
  const namespace = createNamespace();

  namespace.bindEmitter(ctx.req);
  namespace.bindEmitter(ctx.res);

  ctx.state.requestId = getRequestId();

  await next();
};
