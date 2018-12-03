import { config } from "./src/config";

module.exports = {
  client: "postgresql",
  connection: {
    database: config.dbName,
    host: config.dbHost,
    password: config.dbPassword,
    user: config.dbUser,
  },
  extension: "ts",
  migrations: {
    directory: "./src/migrations-new",
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
