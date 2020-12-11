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

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(viewsPath, { noCache: process.env.NODE_ENV !== "production" }),
  );
  env.addFilter("shorten", (str, count) => str.slice(0, count || 5));
  env.addFilter("static", (filename) => manifest[filename] || filename);

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
