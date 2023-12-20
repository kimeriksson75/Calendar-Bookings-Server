const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  BASE_URL: process.env.BASE_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_URI_PRODUCTION: process.env.MONGODB_URI_PRODUCTION,
  PORT: process.env.PORT,
  API_VERSION: process.env.API_VERSION,
  NODE_MAILER_SERVICE: process.env.NODE_MAILER_SERVICE,
  NODE_MAILER_PORT: process.env.NODE_MAILER_PORT,
  NODE_MAILER_USER: process.env.NODE_MAILER_USER,
  NODE_MAILER_PASS: process.env.NODE_MAILER_PASS,
  NODE_MAILER_FROM: process.env.NODE_MAILER_FROM,
};
