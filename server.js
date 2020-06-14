require('rootpath')();
require('dotenv').config();
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


// Add a health check route in express
app.get('/_health', (req, res) => {
  res.status(200).send('ok')
})
app.get('/', function (req, res) {
  res.status(200).send('ok')
});
app.use('/users', require('./users/user.controller'));
app.use('/bookings', require('./bookings/booking.controller'));
app.use('/residences', require('./residences/residence.controller'));
app.use('/apartments', require('./apartments/apartment.controller'));
app.use('/services', require('./services/service.controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
