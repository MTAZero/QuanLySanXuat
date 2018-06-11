var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    material: {type: mongoose.Schema.Types.ObjectId, ref: 'Material'},
    quantity: Number
});
mongoose.model('Product_Material', Schema);

module.exports = mongoose.model('Product_Material');