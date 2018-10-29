import { Logger, QueryRunner } from "typeorm";
import { config } from "./src/config";
import { logger } from "./src/logger";

class MyCustomLogger implements Logger {
  protected static stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      logger.warn("Could not convert parameters", { error });
      return parameters;
    }
  }
  public log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
    let logFunc;
    if (level === "log") {
      logFunc = logger.debug;
    } else if (level === "info") {
      logFunc = logger.info;
    } else if (level === "warn") {
      logFunc = logger.warn;
    }
    logFunc("TypeORM log", { typeorm_message: message });
  }

  public logMigration(message: string, queryRunner?: QueryRunner): any {
    logger.info("TypeORM migration", { typeorm_message: message });
  }

  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (config.logSQL) {
      const sql =
        query +
        (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
      logger.debug("SQL", { query: sql });
    }
  }

  public logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query + (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
    logger.error("SQL ERROR", { query: sql, error });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query + (parameters && parameters.length ? " -- PARAMETERS: " + MyCustomLogger.stringifyParams(parameters) : "");
    logger.warn("SQL SLOW", { query: sql, duration: time });
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    logger.info("TypeORM schema build", { typeorm_message: message });
  }
}

export = [
  {
    cli: {
      entitiesDir: "src/entities",
      migrationsDir: "src/migrations",
    },
    database: config.dbName,
    entities: ["src/entities/*{.ts,.js}"],
    extra: {
      connectionTimeoutMillis: 2000,
      statement_timeout: 10000,
    },
    host: config.dbHost,
    logger: new MyCustomLogger(),
    maxQueryExecutionTime: 1000,
    migrations: ["src/migrations/*{.ts,.js}"],
    name: "default",
    password: config.dbPassword,
    port: 5432,
    type: "postgres",
    username: config.dbUser,
  },
];
