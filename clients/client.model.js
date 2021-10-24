const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userid: {type: String, required: true},
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: false, 
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email address',
      isAsync: false,
    },
  },
});

clientSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Client', clientSchema);