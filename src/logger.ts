import * as winston from "winston";
import { getContextStorage } from "@emartech/cls-adapter";

const myFormat = winston.format.printf(info => {
  const message = `${info.timestamp} ${info.level}: ${info.message.trim()}`;
  const allInfo = Object.assign(info, getContextStorage());
  const extra = Object.keys(allInfo)
    .filter(kname => !['message', 'level', 'timestamp'].includes(kname))
    .map(kname => `[${kname}: ${info[kname]}]`)
    .join(' ');
  return `${message} ${extra}`;
});

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  transports: [new winston.transports.Console()],
});
