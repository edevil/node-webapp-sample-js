import { config } from "@app/config";
import { Logger, QueryRunner } from "typeorm";
import { logger } from "@app/logger";

class MyCustomLogger implements Logger {
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {}

  logMigration(message: string, queryRunner?: QueryRunner): any {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query + (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
    logger.debug("SQL", { query: sql });
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query + (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
    logger.error("SQL ERROR", { query: sql, error: error });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query + (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
    logger.warning("SQL SLOW", { query: sql, duration: time });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}

  protected static stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      logger.warning("Could not convert parameters", { error: error });
      return parameters;
    }
  }
}

export = [
  {
    name: "default",
    type: "postgres",
    host: config.dbHost,
    port: 5432,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    logger: new MyCustomLogger(),
    maxQueryExecutionTime: 1000,
    entities: ["src/entities/*{.ts,.js}"],
    migrations: ["src/migrations/*{.ts,.js}"],
    cli: {
      entitiesDir: "src/entities",
      migrationsDir: "src/migrations",
    },
  },
];
