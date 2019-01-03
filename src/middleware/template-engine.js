const appPath = require("app-root-path");
const views = require("koa-views");
const path = require("path");
const { logger } = require("../logger");
const nunjucks = require("nunjucks");

const viewsPath = path.join(appPath.toString(), "/views");

const getTemplateEngine = () => {
  let manifest;
  try {
    manifest = require("../../static/build/manifest");
  } catch (err) {
    logger.info(`Could not load asset manifest: ${err}`);
    manifest = {};
  }

  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewsPath));
  env.addFilter("shorten", function(str, count) {
    return str.slice(0, count || 5);
  });

  return views(viewsPath, {
    map: {
      html: "nunjucks",
    },
    options: {
      nunjucksEnv: env,
    },
  });
};

module.exports = {
  getTemplateEngine,
};
