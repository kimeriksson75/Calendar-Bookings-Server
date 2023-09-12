const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  apartment: { type: String, unique: true, required: true },
  residence: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;