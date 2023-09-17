'use strict';

require('dotenv').config();

require('rootpath')();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Add a health check route in express
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.get('/', function (req, res) {
  res.status(200).send('ok')
});
app.get('/verify-access-token', jwt.authenticateToken, (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/users', require('./users/user.routes'));
app.use('/bookings', require('./bookings/booking.routes'));
app.use('/residences', require('./residences/residence.routes'));
app.use('/apartments', require('./apartments/apartment.routes'));
app.use('/services', require('./services/service.routes'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000;

const { User, Apartment, Booking, Residence, Service } = require('_helpers/db');

AdminBro.registerAdapter(mongooseAdminBro)
const AdminBroOptions = {
  resources: [User, Apartment, Booking, Residence, Service],
}

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminBro.buildRouter(adminBro)

app.use(adminBro.options.rootPath, router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
