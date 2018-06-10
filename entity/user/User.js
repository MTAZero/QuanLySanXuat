var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: String,
    sex: int, // 0: Nu, 1: Nam
    dob: int, // date of birthday 
    phonenumber: String,
    type: int, // 1: admin, 2: employee, 3: customer
    // dang nhap
    email: String,
    password: String // md5
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');