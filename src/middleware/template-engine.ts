import * as views from "koa-views";
import * as path from "path";
import * as appPath from "app-root-path";

const viewsPath = path.join(appPath.toString(), "/views");

export const getTemplateEngine = () =>
  views(viewsPath, {
    options: {
      settings: {
        views: viewsPath,
      },
    },
    map: {
      html: "nunjucks",
    },
  });
