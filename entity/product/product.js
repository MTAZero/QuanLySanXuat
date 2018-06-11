var mongoose = require('mongoose');
var ProductSchema = new mongoose.Schema({
    name: String,
    unit: String,
    price: Number,
    note: String,
    expiry: Number,// month
    imageUrl: String 
});
mongoose.model('Product', ProductSchema);

module.exports = mongoose.model('Product');