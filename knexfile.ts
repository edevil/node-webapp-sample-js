import { config } from "./src/config";

module.exports = {
  client: "postgresql",
  connection: {
    database: config.dbName,
    host: config.dbHost,
    password: config.dbPassword,
    user: config.dbUser,
  },
  pool: {
    min: 2,
    max: 10,
  },
  
  migrations: {
    directory: "./src/migrations-new",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  extension: "ts",
};
