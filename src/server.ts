import * as Koa from "koa";
import { databaseInitializer } from "initializers/database";
import { graphqlInitializer } from "initializers/graphql";
import { routes } from "routes";
import { getKoaMiddleware } from "@emartech/cls-adapter";
import { config } from "config";
import { getRequestLogger } from "./middleware/request-logger";
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';

const bootstrap = async () => {
  await databaseInitializer();

  const app = new Koa();

  app
    .use(getKoaMiddleware())
    .use(getRequestLogger())
    .use(helmet())
    .use(cors({origin: "localhost"}))
    .use(routes.routes())
    .use(routes.allowedMethods());

  graphqlInitializer(app);
  app.listen(config.port);
};

bootstrap().catch(console.error);
