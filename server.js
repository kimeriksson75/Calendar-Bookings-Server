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
app.use('/bookings', jwt.authenticateToken, require('./bookings/booking.routes'));
app.use('/residences', jwt.authenticateToken, require('./residences/residence.routes'));
app.use('/apartments', jwt.authenticateToken, require('./apartments/apartment.routes'));
app.use('/services', jwt.authenticateToken, require('./services/service.routes'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
