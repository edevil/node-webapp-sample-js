import * as Knex from "knex";
import { Model } from "objection";
import { createConnection } from "typeorm";
import * as knexfile from "../../knexfile";
import { logger } from "../logger";

let pool;

export const databaseInitializer = async () => {
  await createConnection();
  pool = initORM();
  logger.info("Database connection established");
};

export async function closeORM() {
  await pool.destroy();
  pool = null;
}

export function initORM(dbName = null) {
  const knexconfig: any = { ...knexfile };
  if (dbName) {
    knexconfig.connection.database = dbName;
  }
  const knex = Knex(knexconfig);
  Model.knex(knex);
  return knex;
}
