import * as views from "koa-views";
import * as path from "path";

export const getTemplateEngine = () =>
  views(path.join(__dirname, "/views"), {
    map: {
      html: "nunjucks",
    },
  });
