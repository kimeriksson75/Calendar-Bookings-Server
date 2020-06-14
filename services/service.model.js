const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  type: { type: String, required: true },
  timeslots: { type: Array, required: true },
  name: { type: String, required: true },
  residence: { type: String, required: true },
  limit: { type: Number }
});

serviceSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Service', serviceSchema);