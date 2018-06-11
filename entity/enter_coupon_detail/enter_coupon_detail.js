var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    enter_coupon: {type: mongoose.Schema.Types.ObjectId, ref: 'Enter_Coupon'},
    material: {type: mongoose.Schema.Types.ObjectId, ref: 'Material'},
    quantity: Number,
    price: Number,
    totalMoney: Number
});
mongoose.model('Enter_Coupon_Detail', Schema);

module.exports = mongoose.model('Enter_Coupon_Detail');