const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  residence: { type: String, required: true }
});

apartmentSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Apartment', apartmentSchema);