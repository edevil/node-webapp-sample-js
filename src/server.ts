import * as Koa from "koa";
import { databaseInitializer } from "initializers/database";
import { graphqlInitializer } from "initializers/graphql";
import { router } from "routes";
import { getKoaMiddleware } from "@emartech/cls-adapter";
import { config } from "config";
import { getRequestLogger } from "./middleware/request-logger";
import * as helmet from "koa-helmet";
import * as cors from "@koa/cors";
import * as session from "koa-session";
import { authInitializer } from "./initializers/authentication";
import { getTemplateEngine } from "./middleware/template-engine";

const bootstrap = async () => {
  await databaseInitializer();

  const app = new Koa();
  app.keys = config.appKeys;

  app
    .use(getKoaMiddleware())
    .use(getRequestLogger())
    .use(helmet())
    .use(cors({ origin: "localhost" }))
    .use(session(app));

  authInitializer(app);

  app
    .use(getTemplateEngine())
    .use(router.routes())
    .use(router.allowedMethods());

  graphqlInitializer(app);
  app.listen(config.port);
};

bootstrap().catch(console.error);
