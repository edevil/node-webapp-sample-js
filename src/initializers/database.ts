import { createConnection } from "typeorm";
import { logger } from "@app/logger";

export const databaseInitializer = async () => {
  await createConnection();

  logger.info("Database connection established");
};
