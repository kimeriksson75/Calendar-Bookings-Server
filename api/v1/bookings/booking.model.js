const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSlot = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, default: "" },
  timeslot: { type: String, required: true },
});

const bookingSchema = new Schema({
  service: { type: String, required: true },
  date: { type: Date, required: true },
  timeslots: [timeSlot],
});

bookingSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Booking", bookingSchema);
