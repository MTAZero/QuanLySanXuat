var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var md5 = require('md5');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());
var User = require('../entity/user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get config file

router.post('/login', function (req, res) {

  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = md5(req.body.password) == user.password;
    if (!passwordIsValid) return res.status(401).send({
      auth: false,
      token: null
    });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({
      id: user._id
    }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({
      auth: true,
      token: token
    });
  });

});

router.get('/logout', function (req, res) {
  res.status(200).send({
    auth: false,
    token: null
  });
});

router.post('/register', function (req, res) {

  var hashedPassword = md5(req.body.password);

  User.create({
      name: req.body.name,
      sex: req.body.sex,
      dob: req.body.dob,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      password: md5(req.body.password),
      type: 3
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user`.");

      // if user is registered without errors
      // create a token
      var token = jwt.sign({
        id: user._id
      }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({
        auth: true,
        token: token
      });
    });

});

router.get('/me', VerifyToken, function (req, res, next) {
  User.findById(req.userId, {
    password: 0
  }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

router.post("/changepassword", VerifyToken, function (req, res) {
  User.findById(req.userId, function (err, user) {
    // check old password
    if (!req.body.oldpassword) return res.status(500).send("old password not exist");
    if (md5(req.body.oldpassword) != user.password) return res.status(500).send("old password not correct");    
    if (!req.body.newpassword) return res.status(500).send("new password not exist");

    User.update({
      _id: req.userId
    }, {
      password: md5(req.body.newpassword)
    }).exec(function (err, user2) {
      if (err) return res.status(500).send(err);
      return res.status(200).send("Successful change password ");
    })
  });
});

module.exports = router;