const mongoose = require("mongoose");
const { MONGODB_URI } = require("../../../config");
const monogoUri =
  MONGODB_URI ?? "mongodb://localhost/node-mongo-registration-login-api";
// connect
mongoose
  .connect(monogoUri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    //console.log(`DB ${monogoUri} connection established`);
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
};
