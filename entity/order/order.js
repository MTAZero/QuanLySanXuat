var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
   date: Number,
   //employee: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   customer: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   total: Number,
   status: Number, // 0: pending, 1: accept, 2: progressing, 3: compelete, -1: cancel
   percent: Number
});
mongoose.model('Order', Schema);

module.exports = mongoose.model('Order');