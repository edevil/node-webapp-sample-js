import * as socketio from "socket.io";
import * as redisAdapter from "socket.io-redis";
import { logger } from "../logger";
import { getRedis } from "./redis";

export const initWebsocket = server => {
  const io = socketio(server);
  const redis = getRedis();
  io.adapter(
    redisAdapter({
      pubClient: redis,
      subClient: redis,
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
