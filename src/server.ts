import { app } from "@app/app";
import { databaseInitializer } from "@app/initializers/database";
import { config } from "@app/config";
import { createTerminus } from "@godaddy/terminus";
import { logger } from "@app/logger";
import * as http from "http";
import { getConnection } from "typeorm";

function onSignal() {
  logger.info("server is starting cleanup");
  return Promise.all([getConnection().close()]);
}

async function onShutdown() {
  logger.info("cleanup finished, server is shutting down");
}

function healthCheck() {
  logger.debug("healthcheck");
  return Promise.resolve(getConnection().manager.query("SELECT 1 AS OK"));
}

function beforeShutdown() {
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

  const server = http.createServer(app.callback());
  createTerminus(server, options);
  server.listen(config.port);
};

bootstrap().catch(console.error);
