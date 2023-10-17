const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    API_VERSION: process.env.API_VERSION
};