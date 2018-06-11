var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: Number,
    price: Number,
    totalMoney: Number
});
mongoose.model('Order_Detail', Schema);

module.exports = mongoose.model('Order_Detail');