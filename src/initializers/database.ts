import { createConnection, Logger, QueryRunner } from "typeorm";
import { Card } from "entities/card";
import { logger } from "logger";

class MyCustomLogger implements Logger {
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {}

  logMigration(message: string, queryRunner?: QueryRunner): any {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    logger.debug("SQL", { query: sql });
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    logger.error("SQL ERROR", { query: sql, error: error });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    logger.warning("SQL SLOW", { query: sql, duration: time });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      logger.warning("Could not convert parameters", { error: error });
      return parameters;
    }
  }
}

export const databaseInitializer = async () => {
  const connection = await createConnection({
    type: "postgres",
    host: "0.0.0.0",
    port: 5432,
    username: "postgres",
    password: "",
    database: "sample_db",
    entities: [Card],
    logger: new MyCustomLogger(),
    synchronize: true,
    maxQueryExecutionTime: 1000,
  });

  logger.info("Database connection established");
};
