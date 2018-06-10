var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: String,
    sex: Number, // 0: Nu, 1: Nam
    dob: Number, // date of birthday 
    phonenumber: String,
    type: Number, // 1: admin, 2: employee, 3: customer
    // dang nhap
    email: String,
    password: String // md5
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');