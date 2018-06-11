var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./order');
var User = require("../user/User");

// // CREATES A NEW order
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        Entity.create({
                date: req.body.date,
                customer: req.userId,
                percent: 0,
                status: 0,
                total: 0
            },
            function (err, order) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. Error : "+err);
                res.status(200).send(order);
            });
    });
});

// RETURNS ALL THE order IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({})
        //.populate("customer")
        .exec(function (err, order) {
            if (err) return res.status(500).send("There was a problem finding the order.");
            res.status(200).send(order);
        });
    });

});

// GETS A SINGLE order FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id)
        //.populate('customer')
        .exec(function (err, order) {
            if (err) return res.status(500).send("There was a problem finding the order.");
            if (!user) return res.status(404).send("No order found.");
            res.status(200).send(order);
        });
    });
});

// GET LIST enter coupon FROM customerID
router.get('/listEnterCoupon/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 2 || req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.find({customer: req.params.id})
        //.populate('customer')
        .exec(function (err, order) {
            if (err) return res.status(500).send("There was a problem finding the order.");
            if (!user) return res.status(404).send("No order found.");
            res.status(200).send(order);
        });
    });
});

// DELETES A order FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, order) {
            if (err) return res.status(500).send("There was a problem deleting the order.");
            res.status(200).send("order: " + order.name + " was deleted.");
        });
    });
});

module.exports = router;