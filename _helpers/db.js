const config = require('config.json');
const mongoose = require('mongoose');

// connect  
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('DB connection established');
  })
  .catch((error) => {
    console.error(`DB connection faild: ${error}`)
    throw new Error('Could not connect to DB')
  })
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model'),
  Booking: require('../bookings/booking.model'),
  Apartment: require('../apartments/apartment.model')
}