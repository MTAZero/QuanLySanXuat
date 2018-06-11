var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
   date: Number,
   employee: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   customer: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   total: Number,
   deposit: Number, // Tiền đặt cọc 
   status: Number, // 0: pending, 1: accept, 2: progressing, 3: compelete
});
mongoose.model('Order', Schema);

module.exports = mongoose.model('Order');