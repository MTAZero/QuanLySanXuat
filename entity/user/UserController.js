var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var md5 = require('md5');

var VerifyToken = require(__root + 'auth/VerifyToken');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require(__root + 'config'); // get our config file

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var User = require('./User');

// // CREATES A NEW USER
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        var pass = "123456";
        if (req.body.password) pass = req.body.password;
        hashpassword = md5(pass);

        User.create({
                name: req.body.name,
                sex: req.body.sex,
                dob: req.body.dob,
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                password: hashpassword,
                type: req.body.type
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
            });
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(users);
        });
    });

});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        User.findById(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.status(200).send(user);
        });
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        User.findByIdAndRemove(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("User: " + user.name + " was deleted.");
        });
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', VerifyToken, function (req, res, next) {

    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            sex: req.body.sex,
            dob: req.body.dob,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            type: req.body.type
        }, {
            new: true
        }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
    });
});


module.exports = router;