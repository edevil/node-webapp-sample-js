import * as appPath from "app-root-path";
import * as mount from "koa-mount";
import * as serve from "koa-static";
import * as path from "path";
import { config } from "../config";

const staticPath = path.join(appPath.toString(), "/static");

export const getStaticMW = () => mount("/static", serve(staticPath, { maxage: config.staticMaxAge }));
