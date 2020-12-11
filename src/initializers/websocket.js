const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const redisAdapter = require("socket.io-redis");
const { config } = require("../config");
const { logger } = require("../logger");
const { getNewRedis } = require("./redis");

let io;

const initWebsocket = (server, app) => {
  const adapter = redisAdapter({
    pubClient: getNewRedis(),
    subClient: getNewRedis(),
  });
  // @ts-ignore
  adapter.prototype.on("error", (err) => logger.error("Socket redis adapter encountered an error", { err }));

  io = socketio(server, {
    adapter,
  });

  io.on("connection", (socket) => {
    logger.debug(`A client has connected`, { socketid: socket.id });
    socket.on("disconnect", () => logger.debug("A user has disconnected"));
    socket.on("chat message", (msg) => {
      logger.debug(`Message: ${msg}`, { userId: socket.request.userId });
      io.emit("chat message", msg);
    });
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    let data;
    try {
      data = jwt.verify(token, config.appKeys[0]);
    } catch (err) {
      logger.debug("Could not validate token", { token });
      return next();
    }

    logger.debug("Decoded token", { data: JSON.stringify(data) });
    socket.request.userId = data.userId;
    return next();
  });
};

const closeWebsocket = () => {
  io.close();
  io = null;
};

module.exports = {
  initWebsocket,
  closeWebsocket,
};
