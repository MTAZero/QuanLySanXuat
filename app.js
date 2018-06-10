var express = require('express');
var app = express();
var db = require('./db');

global.__root   = __dirname + '/'; 

var UserController = require('./user/UserController');

app.use('/users', UserController);

module.exports = app;