const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email address',
      isAsync: false,
    },
  },
});

userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema);