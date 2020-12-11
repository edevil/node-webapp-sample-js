const i18n = require("koa-i18n");

const i18nInitializer = (app) => {
  app.use(
    i18n(app, {
      directory: "./locales",
      extension: ".json",
      locales: ["en", "pt"],
      modes: ["cookie", "header"],
    }),
  );
};

module.exports = {
  i18nInitializer,
};
