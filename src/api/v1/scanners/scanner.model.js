const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scannerSchema = new Schema({
    scannerId: { type: String, required: true },
    residenceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Residence",
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
    },
    types: {
        type: [String],
        enum: ["booking", "gate"],
        default: ["booking"],
      },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

scannerSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Scanner", scannerSchema);