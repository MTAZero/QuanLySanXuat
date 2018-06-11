var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
   date: Number,
   user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   total: Number
});
mongoose.model('Enter_Coupon', Schema);

module.exports = mongoose.model('Enter_Coupon');