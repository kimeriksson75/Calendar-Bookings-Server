const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  date: { type: Date, required: true },
  timeslots: { type: Array, required: true }
});

bookingSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Booking', bookingSchema);