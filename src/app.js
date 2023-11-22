"use strict";

require("dotenv").config();
const { API_VERSION = "v1" } = require("./config");

require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const compressFilter = require("./utils/compressFilter.util");
const bodyParser = require("body-parser");
const errorHandler = require("./_helpers/error-handler");

const AdminBro = require("admin-bro");
const mongooseAdminBro = require("@admin-bro/mongoose");
const expressAdminBro = require("@admin-bro/express");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger/index.json");
app.set("view engine", "ejs");
app.use(helmet());
app.use(compression({ filter: compressFilter }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(`/api/${API_VERSION}`, require(`./api/${API_VERSION}/`));
app.use(errorHandler);

const { User, Apartment, Booking, Residence, Service, Token, Scanner, Tag } = require(
  `./api/${API_VERSION}/_helpers/db`,
);

AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions = {
  resources: [User, Apartment, Booking, Residence, Service, Token, Scanner, Tag, ],
};

const adminBro = new AdminBro(AdminBroOptions);
const expressAdminBroRouter = expressAdminBro.buildRouter(adminBro);

app.use(adminBro.options.rootPath, expressAdminBroRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
