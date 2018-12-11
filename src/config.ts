import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

interface IConfig {
  port: number;
  logSQL: boolean;
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
  tokenLifetime: number;
  gqlDepthLimit: number;
  gqlMaxFileSize: number;
  gqlMaxFiles: number;
  gqlMaxPerPage: number;
  gqlPath: string;
  showPlayground: boolean;
  trustXHeaders: boolean;
  ravenDSN: string;
  staticMaxAge: number;
}

const config: IConfig = {
  appKeys: process.env.APP_KEYS ? JSON.parse(process.env.APP_KEYS) : ["shhh, don't tell anyone"],
  baseURL: process.env.BASE_URL || "http://example.com:3000",
  dbHost: process.env.DB_HOST || "localhost",
  dbName: process.env.DB_NAME || "sample_db",
  dbPassword: process.env.DB_PASSWORD || "",
  dbUser: process.env.DB_USER || "postgres",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "googleid",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "googlesecret",
  gqlDepthLimit: +process.env.GQL_DEPTH_LIMIT || 5,
  gqlMaxFileSize: 10000000,
  gqlMaxFiles: 2,
  gqlMaxPerPage: +process.env.GQL_MAX_PER_PAGE || 100,
  gqlPath: process.env.GQL_PATH || "/graphql",
  logSQL: process.env.LOG_SQL ? process.env.LOG_SQL.toLowerCase() === "true" : true,
  origins: process.env.ORIGINS ? JSON.parse(process.env.ORIGINS) : ["http://localhost:3000", "http://example.com:3000"],
  port: +process.env.PORT || 3000,
  ravenDSN: process.env.RAVEN_DSN || "",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPrefix: process.env.REDIS_PREFIX || "sample-node",
  showPlayground: process.env.SHOW_PLAYGROUND ? process.env.SHOW_PLAYGROUND.toLowerCase() === "true" : true,
  staticMaxAge: 31536000000,
  tokenLifetime: 60,
  trustXHeaders: process.env.TRUST_X_HEADERS ? process.env.TRUST_X_HEADERS.toLowerCase() === "true" : false,
};

export { config };
