var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    date: Number,
    percent: Number,
    note: String,
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
mongoose.model('Work_Progress', Schema);

module.exports = mongoose.model('Work_Progress');