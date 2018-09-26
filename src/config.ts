import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

interface IConfig {
  port: number;
  debugLogging: boolean;
  dbHost: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
}

const config: IConfig = {
  port: +process.env.PORT || 3000,
  debugLogging: process.env.NODE_ENV == "development",
  dbHost: process.env.DB_HOST || "localhost",
  dbName: process.env.DB_NAME || "sample_db",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "",
};

export { config };
