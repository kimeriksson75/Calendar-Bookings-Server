const mongoose = require("mongoose");
const { MONGODB_URI } = require("../../../config");
// connect
mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.info(`DB ${MONGODB_URI} connection established`);
  })
  .catch((error) => {
    console.error(`DB connection faild: ${error}`);
    throw new Error("Could not connect to DB");
  });
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  Booking: require("../bookings/booking.model"),
  Apartment: require("../apartments/apartment.model"),
  Service: require("../services/service.model"),
  Residence: require("../residences/residence.model"),
  Token: require("../tokens/token.model"),
  Scanner: require("../scanners/scanner.model"),
  Tag: require("../tags/tag.model"),
};
