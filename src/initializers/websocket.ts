import * as socketio from "socket.io";
import * as redisAdapter from "socket.io-redis";
import { logger } from "../logger";
import { getNewRedis } from "./redis";

let io: socketio.Server;

export const initWebsocket = server => {
  io = socketio(server);
  io.adapter(
    redisAdapter({
      pubClient: getNewRedis(),
      subClient: getNewRedis(),
    }),
  );

  io.on("connection", socket => {
    logger.debug("A client has connected");
    socket.on("disconnect", () => logger.debug("A user has disconnected"));
    socket.on("chat message", msg => {
      logger.debug(`Message: ${msg}`);
      io.emit("chat message", msg);
    });
  });
};

export const closeWebsocket = () => {
  io.close();
  io = null;
};
