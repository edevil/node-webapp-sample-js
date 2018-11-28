import * as Knex from "knex";
import { Model } from "objection";
import { createConnection } from "typeorm";
import { config } from "../config";
import { logger } from "../logger";

let pool;

export const databaseInitializer = async () => {
  await createConnection();
  pool = initORM(config.dbName);
  logger.info("Database connection established");
};

export async function closeORM() {
  await pool.destroy();
  pool = null;
}

export function initORM(dbName) {
  const knex = Knex({
    client: "pg",
    connection: {
      database: dbName,
      host: config.dbHost,
      password: config.dbPassword,
      user: config.dbUser,
    },
    debug: true,
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
      tableName: "migrations",
    },
  });
  Model.knex(knex);
  return knex;
}
