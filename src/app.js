const clsFactory = require("@emartech/cls-adapter");
const Koa = require("koa");
const helmet = require("koa-helmet");
const locale = require("koa-locale");
const session = require("koa-session");
const { config } = require("./config");
const { graphqlInitializer } = require("./initializers/graphql");
const { i18nInitializer } = require("./initializers/i18n");
const { logger } = require("./logger");
const { getAuthMW } = require("./middleware/authentication");
const { getBinderMW } = require("./middleware/bind-emitters");
const { getCORSMW } = require("./middleware/cors-verifier");
const { requestLoggerMW } = require("./middleware/request-logger");
const { getStaticMW } = require("./middleware/static-content");
const { getTemplateEngine } = require("./middleware/template-engine");
const { router } = require("./routes");

const app = new Koa();
app.keys = config.appKeys;
app.proxy = config.trustXHeaders;

app
  .use(clsFactory.getKoaMiddleware())
  .use(getBinderMW())
  .use(requestLoggerMW)
  .use(helmet())
  .use(getCORSMW())
  .use(session(app));

locale(app);
i18nInitializer(app);

app
  .use(getAuthMW())
  .use(getTemplateEngine())
  .use(router.routes())
  .use(router.allowedMethods());

graphqlInitializer(app);

app.use(getStaticMW());

app.on("error", (err, ctx) => {
  logger.error("Error processing request", {
    exception_message: err.message,
    exception_stack: err.stack,
    requestId: ctx.state.requestId,
  });
});

module.exports = {
  app,
};
