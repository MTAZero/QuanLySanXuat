var express = require('express');
var app = express();
var db = require('./db');

global.__root   = __dirname + '/'; 

var UserController = require('./entity/user/UserController');
var AuthController = require('./auth/AuthController');
var MaterialController = require('./entity/material/materialController');
var ProductController = require('./entity/product/productController');

app.use('/users', UserController);
app.use('/auth', AuthController);
app.use('/material', MaterialController);
app.use("/product",ProductController);

module.exports = app;