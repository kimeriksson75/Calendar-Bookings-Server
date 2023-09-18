'use strict';

require('dotenv').config();

require('rootpath')();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');

const AdminBro = require('admin-bro');
const mongooseAdminBro = require('@admin-bro/mongoose');
const expressAdminBro = require('@admin-bro/express');
const swaggerUi = require('swagger-ui-express'),
  
swaggerDocument = require('./swagger/index.json');


app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1', require('./api/v1/index'));
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000;

const { User, Apartment, Booking, Residence, Service } = require('./api/v1/_helpers/db');

AdminBro.registerAdapter(mongooseAdminBro)
const AdminBroOptions = {
  resources: [User, Apartment, Booking, Residence, Service],
}

const adminBro = new AdminBro(AdminBroOptions)
const expressAdminBroRouter = expressAdminBro.buildRouter(adminBro)

app.use(adminBro.options.rootPath, expressAdminBroRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
