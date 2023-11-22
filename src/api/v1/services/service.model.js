const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSlot = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, default: "" },
  timeslot: { type: String, required: true },
});

const serviceSchema = new Schema({
  type: { type: String, required: true },
  timeslots: [timeSlot],
  alternateTimeslots: [timeSlot],
  name: { type: String, required: true },
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Residence",
    required: true,
  },
  limit: { type: Number },
});

serviceSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Service", serviceSchema);
