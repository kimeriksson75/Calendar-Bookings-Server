const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  apartmentid: { type: String, unique: true, required: true }
});

userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema);