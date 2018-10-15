import { app } from "./app";
import { databaseInitializer } from "./initializers/database";
import { config } from "./config";
import { createTerminus } from "@godaddy/terminus";
import { logger } from "./logger";
import * as http from "http";
import { getConnection } from "typeorm";
import { closeRedis, initRedis } from "./initializers/redis";

function onSignal() {
  logger.info("server is starting cleanup");

  return Promise.all([getConnection().close(), Promise.resolve(closeRedis())]);
}

async function onShutdown() {
  logger.info("cleanup finished, server is shutting down");
}

function healthCheck() {
  return Promise.resolve(getConnection().manager.query("SELECT 1 AS OK"));
}

function beforeShutdown() {
  logger.debug("Will setup shutdown timer");
  return new Promise(resolve => {
    setTimeout(resolve, 5000);
  });
}

function doLog(msg: string, err: Error): void {
  logger.error(msg, { err });
}

const options = {
  healthChecks: {
    "/healthcheck": healthCheck,
  },
  timeout: 1000,
  onSignal,
  onShutdown,
  doLog,
  beforeShutdown,
};

const bootstrap = async () => {
  await databaseInitializer();
  initRedis();

  const server = http.createServer(app.callback());
  createTerminus(server, options);
  server.listen(config.port);
};

bootstrap().catch(console.error);
