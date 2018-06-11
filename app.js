var express = require('express');
var app = express();
var db = require('./db');

global.__root   = __dirname + '/'; 

var UserController = require('./entity/user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);

var MaterialController = require('./entity/material/materialController');
app.use('/material', MaterialController);

var ProductController = require('./entity/product/productController');
app.use("/product",ProductController);

var ProductMaterialController = require('./entity/product_masterial/product_materialController');
app.use("/product_material", ProductMaterialController);

module.exports = app;