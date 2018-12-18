const Redis = require("ioredis");
const { config } = require("../config");
const { logger } = require("../logger");

let conn;

function initRedis() {
  conn = getNewRedis(false);
}

function closeRedis() {
  conn.disconnect();
  conn = null;
}

function getRedis() {
  return conn;
}

function getNewRedis(retries = true) {
  const newConn = new Redis({
    host: config.redisHost,
    keyPrefix: config.redisPrefix,
    maxRetriesPerRequest: retries ? null : 3,
  });
  newConn.on("error", err => logger.error("Problems using redis", { err }));
  return newConn;
}

module.exports = {
  initRedis,
  closeRedis,
  getRedis,
  getNewRedis,
};
