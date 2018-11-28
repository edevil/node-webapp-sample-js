import * as Knex from "knex";
import { Model } from "objection";
import { createConnection } from "typeorm";
import { config } from "../config";
import { logger } from "../logger";

export const databaseInitializer = async () => {
  await createConnection();

  const knex = Knex({
    client: "pg",
    connection: {
      database: config.dbName,
      host: config.dbHost,
      password: config.dbPassword,
      user: config.dbUser,
    },
    debug: true,
    log: {
      warn(message) {
        logger.warn(message);
      },
      error(message) {
        logger.error(message);
      },
      deprecate(message) {
        logger.warn(message);
      },
      debug(message) {
        logger.debug("SQL", message);
      },
    },
    migrations: {
      tableName: "migrations",
    },
  });
  Model.knex(knex);

  logger.info("Database connection established");
};
