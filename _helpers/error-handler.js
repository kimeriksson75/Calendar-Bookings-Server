const logger = require("pino")();

const errorHandler = (err, req, res, next) => {
  if (err?.message && err?.statusCode) {
    logger.error(
      `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}}`,
    );
  }
  return res
    .status(err.statusCode || 500)
    .json({ message: err?.message || "Internal Server Error" });
};
module.exports = errorHandler;
