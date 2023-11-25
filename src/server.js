const http = require("http");
const logger = require("pino")();
const app = require("./app");
const { PORT } = require("./config");
const { Server } = require("socket.io");
const GracefulShutdownManager =
  require("@moebius/http-graceful-shutdown").GracefulShutdownManager;

const httpServer = http.createServer(app);


const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// httpServer.setTimeout(5000);
httpServer.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

const shutdownManager = new GracefulShutdownManager(httpServer);
const onProcessInterrupt = (signal) => {
  logger.info(
    `Termination signal is received from OS (' ${signal} '), the application will terminate`,
  );
  //noinspection JSIgnoredPromiseFromCall
  shutdownManager.terminate(() => {
    logger.info("Server is terminated");
  });
};

process.on("SIGTERM", () => onProcessInterrupt("SIGTERM"));
process.on("SIGINT", () => onProcessInterrupt("SIGINT"));
process.on("uncaughtException", () => onProcessInterrupt("uncaughtException"));
process.on("unhandledRejection", () =>
  onProcessInterrupt("unhandledRejection"),
);

process.on("exit", () => {
  logger.info("Exiting");
});
