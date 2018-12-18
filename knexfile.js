const { config } = require("./src/config");
const { logger } = require("./src/logger");

module.exports = {
  client: "postgresql",
  connection: {
    database: config.dbName,
    host: config.dbHost,
    password: config.dbPassword,
    user: config.dbUser,
  },
  debug: true,
  extension: "ts",
  log: {
    warn(message) {
      logger.warn("SQL", message);
    },
    error(message) {
      logger.error("SQL", message);
    },
    deprecate(message) {
      logger.warn("SQL", message);
    },
    debug(message) {
      logger.debug("SQL", message);
    },
  },
  migrations: {
    directory: "./src/migrations",
    tableName: "knex_migrations",
  },
  pool: {
    max: 10,
    min: 2,
  },
  seeds: {
    directory: "./seeds",
  },
};
