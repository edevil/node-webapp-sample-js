import * as path from "path";
import * as appPath from "app-root-path";
import * as serve from "koa-static";
import * as mount from "koa-mount";

const staticPath = path.join(appPath.toString(), "/static");

export const getStaticMW = () => mount("/static", serve(staticPath));
