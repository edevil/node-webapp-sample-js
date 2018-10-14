import * as Redis from "ioredis";
import { config } from "../config";
import { logger } from "../logger";

let conn: Redis.Redis;

export function initRedis(): void {
  conn = new Redis({
    host: config.redisHost,
    keyPrefix: config.redisPrefix,
    maxRetriesPerRequest: 3,
  });
  conn.on("error", err => logger.error("Problems using redis", { err }))
}

export function closeRedis(): void {
  conn.disconnect();
  conn = null;
}

export function getRedis(): Redis.Redis {
  return conn;
}
