const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: { type: String, required: true },
    clientid: {type: String, required: true},
    price: {type: Number, required: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
  
});

activitySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Activity', activitySchema);