const appPath = require("app-root-path");
const views = require("koa-views");
const path = require("path");

const viewsPath = path.join(appPath.toString(), "/views");

const getTemplateEngine = () =>
  views(viewsPath, {
    map: {
      html: "nunjucks",
    },
    options: {
      settings: {
        views: viewsPath,
      },
    },
  });

module.exports = {
  getTemplateEngine,
};
