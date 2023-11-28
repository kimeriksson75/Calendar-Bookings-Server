const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tag: { type: String, required: true },
    scannerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Scanner",
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Service",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

tagSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Tag", tagSchema);