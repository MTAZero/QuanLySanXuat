var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
var ClassController = require('./entity/Class/ClassController');
var StudentController = require('./entity/Student/StudentController');

app.use('/users', UserController);
app.use('/class', ClassController);
app.use('/student', StudentController);

module.exports = app;