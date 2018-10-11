import * as Koa from "koa";
import { config } from "./config";
import { getKoaMiddleware } from "@emartech/cls-adapter";
import * as helmet from "koa-helmet";
import { getRequestLogger } from "./middleware/request-logger";
import * as session from "koa-session";
import { authInitializer } from "./initializers/authentication";
import { getTemplateEngine } from "./middleware/template-engine";
import { router } from "./routes";
import { graphqlInitializer } from "./initializers/graphql";
import { getBinderMW } from "./middleware/bind-emitters";
import * as locale from "koa-locale";
import { i18nInitializer } from "./initializers/i18n";
import { staticInitializer } from "./initializers/static-content";
import { getCORSMW } from "./middleware/cors-verifier";

export const app = new Koa();
app.keys = config.appKeys;

app
  .use(getKoaMiddleware())
  .use(getBinderMW())
  .use(getRequestLogger())
  .use(helmet())
  .use(getCORSMW())
  .use(session(app));

locale(app);
i18nInitializer(app);
authInitializer(app);

app
  .use(getTemplateEngine())
  .use(router.routes())
  .use(router.allowedMethods());

graphqlInitializer(app);
staticInitializer(app);
