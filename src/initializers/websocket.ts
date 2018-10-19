import * as socketio from "socket.io";
import * as redisAdapter from "socket.io-redis";
import { config } from "../config";
import { logger } from "../logger";
import { getNewRedis } from "./redis";

let io: socketio.Server;

export const initWebsocket = (server, app) => {
  io = socketio(server, {
    adapter: redisAdapter({
      pubClient: getNewRedis(),
      subClient: getNewRedis(),
    }),
    origins: config.origins,
  });

  io.on("connection", socket => {
    logger.debug(`A client has connected`, { socketid: socket.id });
    socket.on("disconnect", () => logger.debug("A user has disconnected"));
    socket.on("chat message", msg => {
      logger.debug(`Message: ${msg}`);
      io.emit("chat message", msg);
    });
  });

  io.use((socket, next) => {
    let error = null;
    try {
      const ctx = app.createContext(socket.request, socket.request.res);
      socket.request.session = ctx.session;
    } catch (err) {
      error = err;
    }
    return next(error);
  });
};

export const closeWebsocket = () => {
  io.close();
  io = null;
};
