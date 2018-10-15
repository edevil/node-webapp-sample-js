import * as appPath from "app-root-path";
import * as mount from "koa-mount";
import * as serve from "koa-static";
import * as path from "path";

const staticPath = path.join(appPath.toString(), "/static");

export const getStaticMW = () => mount("/static", serve(staticPath));
