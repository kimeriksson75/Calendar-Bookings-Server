const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Residence",
    required: true,
  },
});

apartmentSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Apartment", apartmentSchema);
