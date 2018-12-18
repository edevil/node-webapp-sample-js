const appPath = require("app-root-path");
const mount = require("koa-mount");
const serve = require("koa-static");
const path = require("path");
const { config } = require("../config");

const staticPath = path.join(appPath.toString(), "/static");

const getStaticMW = () => mount("/static", serve(staticPath, { maxage: config.staticMaxAge }));

module.exports = {
  getStaticMW,
};
