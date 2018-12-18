const Knex = require("knex");
const { Model } = require("objection");
const knexfile = require("../../knexfile");
const { logger } = require("../logger");

let pool;

const databaseInitializer = async () => {
  pool = initORM();
  logger.info("Database connection established");
};

async function closeORM() {
  await pool.destroy();
  pool = null;
}

function initORM(dbName = null) {
  const knexconfig = { ...knexfile };
  if (dbName) {
    knexconfig.connection.database = dbName;
  }
  const knex = Knex(knexconfig);
  Model.knex(knex);
  return knex;
}

function dbHealth() {
  return pool.raw("SELECT 1 AS OK");
}

module.exports = {
  databaseInitializer,
  closeORM,
  initORM,
  dbHealth,
};
