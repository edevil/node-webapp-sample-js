import { app } from "@app/app";
import { databaseInitializer } from "@app/initializers/database";
import { config } from "@app/config";

const bootstrap = async () => {
  await databaseInitializer();

  app.listen(config.port);
};

bootstrap().catch(console.error);
