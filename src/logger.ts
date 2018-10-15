import { getContextStorage } from "@emartech/cls-adapter";
import * as winston from "winston";

const addContextFormat = winston.format((info, opts) => {
  const allInfo = {...info, ...getContextStorage()};
  allInfo.severity = allInfo.level.toUpperCase();
  return allInfo;
});

const myFormat = winston.format.printf(info => {
  const message = `${info.timestamp} ${info.level}: ${info.message.trim()}`;
  const extra = Object.keys(info)
    .filter(kname => !["message", "level", "timestamp"].includes(kname))
    .map(kname => `[${kname}: ${info[kname]}]`)
    .join(" ");
  return `${message} ${extra}`;
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    addContextFormat(),
    process.env.NODE_ENV !== "production" ? myFormat : winston.format.json(),
  ),
  level: "debug",
  transports: [new winston.transports.Console({ silent: process.env.NODE_ENV === "test" })],
});
