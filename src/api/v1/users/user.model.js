const mongoose = require("mongoose");
require("mongoose-type-email");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: mongoose.SchemaTypes.Email, unique: true, required: true },
  hash: { type: String, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Residence",
    required: true,
  },
});

userSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("User", userSchema);
