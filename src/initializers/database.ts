import { createConnection } from "typeorm";
import { logger } from "logger";

export const databaseInitializer = async () => {
  await createConnection();

  logger.info("Database connection established");
};
