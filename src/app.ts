import * as Koa from "koa";
import { config } from "@app/config";
import { getKoaMiddleware } from "@emartech/cls-adapter";
import * as helmet from "koa-helmet";
import { getRequestLogger } from "@app/middleware/request-logger";
import * as cors from "@koa/cors";
import * as session from "koa-session";
import { authInitializer } from "@app/initializers/authentication";
import { getTemplateEngine } from "@app/middleware/template-engine";
import { router } from "@app/routes";
import { graphqlInitializer } from "@app/initializers/graphql";
import { getBinderMW } from "@app/middleware/bind-emitters";

export const app = new Koa();
app.keys = config.appKeys;

app
  .use(getKoaMiddleware())
  .use(getBinderMW())
  .use(getRequestLogger())
  .use(helmet())
  .use(cors({ origin: config.origin }))
  .use(session(app));

authInitializer(app);

app
  .use(getTemplateEngine())
  .use(router.routes())
  .use(router.allowedMethods());

graphqlInitializer(app);
