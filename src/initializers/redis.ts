import * as Redis from "ioredis";
import { config } from "../config";
import { logger } from "../logger";

let conn: Redis.Redis;

export function initRedis(): void {
  conn = getNewRedis();
}

export function closeRedis(): void {
  conn.disconnect();
  conn = null;
}

export function getRedis(): Redis.Redis {
  return conn;
}

export function getNewRedis(): Redis.Redis {
  const newConn = new Redis({
    host: config.redisHost,
    keyPrefix: config.redisPrefix,
    maxRetriesPerRequest: 3,
  });
  newConn.on("error", err => logger.error("Problems using redis", { err }));
  return newConn;
}
