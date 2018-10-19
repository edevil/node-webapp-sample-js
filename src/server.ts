import { createTerminus } from "@godaddy/terminus";
import * as http from "http";
import { getConnection } from "typeorm";
import { app } from "./app";
import { config } from "./config";
import { databaseInitializer } from "./initializers/database";
import { closeRedis, initRedis } from "./initializers/redis";
import { initWebsocket } from "./initializers/websocket";
import { logger } from "./logger";

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
  beforeShutdown,
  doLog,
  healthChecks: {
    "/healthcheck": healthCheck,
  },
  onShutdown,
  onSignal,
  timeout: 1000,
};

const bootstrap = async () => {
  await databaseInitializer();
  initRedis();

  const server = http.createServer(app.callback());
  createTerminus(server, options);
  initWebsocket(server);
  server.listen(config.port);
};

bootstrap().catch(err => {
  logger.error("Error on server", {
    exception_message: err.message,
    exception_stack: err.stack,
  });
});
