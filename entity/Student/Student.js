var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var Student = new mongoose.Schema({  
    name: String,
    dob: Date,
    class: {type: Schema.Types.ObjectId, ref: 'Class'}
});
mongoose.model('student', Student);

module.exports = mongoose.model('student');