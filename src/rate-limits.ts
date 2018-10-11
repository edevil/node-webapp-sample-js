import * as ratelimit from "koa-ratelimit";
import { getRedis } from "./initializers/redis";

const redisProxy = new Proxy(
  {},
  {
    get(target, propKey) {
      return getRedis()[propKey];
    },
  },
);

export const loginRLMW = ratelimit({
  db: redisProxy,
  duration: 10000,
  errorMessage: "Slow down",
  id: ctx => ctx.ip,
  headers: {
    remaining: "Rate-Limit-Remaining",
    reset: "Rate-Limit-Reset",
    total: "Rate-Limit-Total",
  },
  max: 10,
  disableHeader: false,
});
