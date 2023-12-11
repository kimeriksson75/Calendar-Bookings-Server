const mongoose = require("mongoose");
require("mongoose-type-email");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: mongoose.SchemaTypes.Email, unique: true, required: true },
  hash: { type: String, unique: true },
  token: { type: String, allowNull: true },
  password: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
  },
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Residence",
    required: true,
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "superAdmin"],
    default: ["user"],
  },
});

userSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("User", userSchema);
