const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  apartment: { type: String, required: true },
});

apartmentSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Apartment', apartmentSchema);