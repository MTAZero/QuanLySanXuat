var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var ClassSchema = new mongoose.Schema({  
  name: String,
  type: String
});
mongoose.model('Class', ClassSchema);

module.exports = mongoose.model('Class');