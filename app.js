var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
var ClassController = require('./entity/Class/ClassController');
app.use('/users', UserController);
app.use('/class', ClassController);

module.exports = app;