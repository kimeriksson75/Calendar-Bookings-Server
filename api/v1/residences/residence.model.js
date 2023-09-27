const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const residenceSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
});

residenceSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Residence", residenceSchema);
