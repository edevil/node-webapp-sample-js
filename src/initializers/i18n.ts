import * as i18n from "koa-i18n";

export const i18nInitializer = app => {
  app.use(
    i18n(app, {
      directory: "./locales",
      locales: ["en", "pt"],
      modes: ["cookie", "header"],
    }),
  );
};
