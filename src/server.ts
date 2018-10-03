import { app } from "app";
import { databaseInitializer } from "initializers/database";
import { config } from "config";

const bootstrap = async () => {
  await databaseInitializer();

  app.listen(config.port);
};

bootstrap().catch(console.error);
