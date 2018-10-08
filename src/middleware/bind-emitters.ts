import { createNamespace } from "@emartech/cls-adapter";

export const getBinderMW = () => async (ctx, next) => {
  const namespace = createNamespace();

  namespace.bindEmitter(ctx.req);
  namespace.bindEmitter(ctx.res);

  await next();
};
