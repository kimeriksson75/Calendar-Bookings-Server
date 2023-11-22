const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tag: { type: String, required: true },
    scannerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "scanner",
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "service",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

tagSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Tag", tagSchema);