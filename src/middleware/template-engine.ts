import * as appPath from "app-root-path";
import * as views from "koa-views";
import * as path from "path";

const viewsPath = path.join(appPath.toString(), "/views");

export const getTemplateEngine = () =>
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
