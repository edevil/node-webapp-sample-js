import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

interface IConfig {
  port: number;
  debugLogging: boolean;
  dbHost: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  appKeys: string[];
  googleClientId: string;
  googleClientSecret: string;
  baseURL: string;
  origins: string[];
  redisHost: string;
  redisPrefix: string;
  gqlDepthLimit: number;
  gqlMaxPerPage: number;
}

const config: IConfig = {
  port: +process.env.PORT || 3000,
  debugLogging: process.env.NODE_ENV == "development",
  dbHost: process.env.DB_HOST || "localhost",
  dbName: process.env.DB_NAME || "sample_db",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "",
  appKeys: process.env.APP_KEYS ? JSON.parse(process.env.APP_KEYS) : ["shhh, don't tell anyone"],
  googleClientId: process.env.GOOGLE_CLIENT_ID || "googleid",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "googlesecret",
  baseURL: process.env.BASE_URL || "http://example.com:3000",
  origins: process.env.ORIGINS ? JSON.parse(process.env.ORIGINS) : ["http://localhost:3000", "http://example.com:3000"],
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPrefix: process.env.REDIS_PREFIX || "sample-node",
  gqlDepthLimit: +process.env.GQL_DEPTH_LIMIT || 5,
  gqlMaxPerPage: +process.env.GQL_MAX_PER_PAGE || 100,
};

export { config };
