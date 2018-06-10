var mongoose = require('mongoose');  
var ClassSchema = new mongoose.Schema({  
  name: String,
  type: String
});
mongoose.model('Class', ClassSchema);

module.exports = mongoose.model('Class');