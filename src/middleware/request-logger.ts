import * as koaLogger from "koa-logger";
import { logger } from "logger";


export const getRequestLogger = () => {
  return koaLogger((str, args) => {
    const [format, method, url, status, time, length] = args;
    if (status === undefined) {
      logger.info("Request started", {method, url});
    } else {
      logger.info("Request finished", {method, url, status, time, length});
    }
  })
};
