import * as Redis from "ioredis";
import { config } from "../config";

let conn: Redis.Redis;

export function initRedis(): void {
  conn = new Redis({
    host: config.redisHost,
  });
}

export function closeRedis(): void {
  conn.disconnect();
  conn = null;
}

export function getRedis(): Redis.Redis {
  return conn;
}
