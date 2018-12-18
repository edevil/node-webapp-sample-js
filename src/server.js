const { createTerminus } = require("@godaddy/terminus");
const Sentry = require("@sentry/node");
const http = require("http");
const { app } = require("./app");
const { config } = require("./config");
const { closeORM, databaseInitializer, dbHealth } = require("./initializers/database");
const { graphqlInstall, shutdownSubscriptions } = require("./initializers/graphql");
const { closeRedis, initRedis } = require("./initializers/redis");
const { closeWebsocket, initWebsocket } = require("./initializers/websocket");
const { logger } = require("./logger");

logger.info("Startup server");

Sentry.init({ dsn: config.ravenDSN });

function onSignal() {
  logger.info("server is starting cleanup");

  return Promise.all([
    closeORM(),
    Promise.resolve(closeRedis()),
    Promise.resolve(closeWebsocket()),
    Promise.resolve(shutdownSubscriptions()),
  ]);
}

async function onShutdown() {
  logger.info("cleanup finished, server is shutting down");
}

function healthCheck() {
  return Promise.resolve(dbHealth());
}

function beforeShutdown() {
  logger.debug("Will setup shutdown timer");
  return new Promise(resolve => {
    setTimeout(resolve, 5000);
  });
}

function doLog(msg, err) {
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
  initWebsocket(server, app);
  graphqlInstall(server);

  app.on("error", (err, ctx) => {
    Sentry.withScope(scope => {
      scope.addEventProcessor(async event => {
        Sentry.Handlers.parseRequest(event, ctx.request);
        event.extra.request_id = ctx.state.requestId;
        return event;
      });
      Sentry.captureException(err);
    });
  });

  server.listen(config.port);
};

bootstrap().catch(err => {
  logger.error("Error on server", {
    exception_message: err.message,
    exception_stack: err.stack,
  });
});
