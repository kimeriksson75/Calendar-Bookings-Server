const mongoose = require('mongoose');
require('mongoose-type-email');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: mongoose.SchemaTypes.Email, unique: true, required: true },
  hash: { type: String, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  residence: { type: mongoose.Schema.Types.ObjectId, ref: 'Residence', required: true }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;