import * as cors from "@koa/cors";
import { config } from "@app/config";

function whitelistOrigin(ctx) {
  const requestOrigin = ctx.accept.headers.origin;
  if (!config.origins.includes(requestOrigin)) {
    return ctx.throw(`${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
}

export const getCORSMW = () => cors({ origin: whitelistOrigin, credentials: true });
