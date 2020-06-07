const mongoose = require('mongoose');

// connect  
mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log(`DB ${process.env.MONGODB_URI} connection established`);
  })
  .catch((error) => {
    console.error(`DB connection faild: ${error}`)
    throw new Error('Could not connect to DB')
  })
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model'),
  Booking: require('../bookings/booking.model'),
  Apartment: require('../apartments/apartment.model'),
  Service: require('../services/service.model')
}