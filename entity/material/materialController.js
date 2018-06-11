var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var md5 = require('md5');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./material');
var User = require("../user/User");

// // CREATES A NEW Material
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.create({
                name: req.body.name,
                unit: req.body.unit,
                quantity: 0,
                note: req.body.note
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
            });
    });
});

// RETURNS ALL THE material IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({}, function (err, material) {
            if (err) return res.status(500).send("There was a problem finding the material.");
            res.status(200).send(material);
        });
    });

});

// GETS A SINGLE material FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id, function (err, material) {
            if (err) return res.status(500).send("There was a problem finding the material.");
            if (!user) return res.status(404).send("No material found.");
            res.status(200).send(material);
        });
    });
});

// DELETES A material FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, material) {
            if (err) return res.status(500).send("There was a problem deleting the material.");
            res.status(200).send("Material: " + material.name + " was deleted.");
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

        Entity.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            unit: req.body.unit,
            note: req.body.note
        }, {
            new: true
        }, function (err, material) {
            if (err) return res.status(500).send("There was a problem updating the Material.");
            res.status(200).send(material);
        });
    });


});


module.exports = router;