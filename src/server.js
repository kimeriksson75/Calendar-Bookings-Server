const app = require("./app");
const { PORT } = require('./config');

const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

//const port =
//  process.env.NODE_ENV === "production" ? process.env.PORT || 8080 : 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const shutdownManager = new GracefulShutdownManager(server);
const onProcessInterrupt = (signal) => {
  console.log(`Termination signal is received from OS (' ${signal} '), the application will terminate`);
  //noinspection JSIgnoredPromiseFromCall
  shutdownManager.terminate(() => {
    console.log('Server is terminated');
  });
}

process.on('SIGTERM', () => onProcessInterrupt('SIGTERM'));
process.on('SIGINT', () => onProcessInterrupt('SIGINT'));
process.on('uncaughtException', () => onProcessInterrupt('uncaughtException'));
process.on('unhandledRejection', () => onProcessInterrupt('unhandledRejection'));

process.on('exit', () => {
  console.error('Exiting');
});