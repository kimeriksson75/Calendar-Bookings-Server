const logger = require("pino")();

const errorHandler = (err, req, res) => {
  const { message = null, statusCode = null } = err;
  if (message && statusCode) {
    logger.error(
      `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}}`,
    );
  }
  return res
    .status(err.statusCode || 500)
    .json({ message: message || "Internal Server Error" });
};
module.exports = errorHandler;
