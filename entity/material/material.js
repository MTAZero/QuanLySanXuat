var mongoose = require('mongoose');
var MaterialSchema = new mongoose.Schema({
    name: String,
    unit: String,
    quantity: Number,
    note: String 
});
mongoose.model('Material', MaterialSchema);

module.exports = mongoose.model('Material');