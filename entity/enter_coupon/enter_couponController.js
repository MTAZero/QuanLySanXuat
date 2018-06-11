var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./enter_coupon');
var User = require("../user/User");

// // CREATES A NEW product
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 2)
            return res.status(500).send("You not have permision");

        Entity.create({
                date: req.body.date,
                user: req.userId,
                total: 0
            },
            function (err, enter_coupon) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. Error : "+err);
                res.status(200).send(enter_coupon);
            });
    });
});

// RETURNS ALL THE enter_coupon IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({})
        //.populate("user")
        .exec(function (err, enter_coupon) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon.");
            res.status(200).send(enter_coupon);
        });
    });

});

// GETS A SINGLE enter_coupon FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id)
        //.populate('user')
        .exec(function (err, enter_coupon) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon.");
            if (!user) return res.status(404).send("No enter_coupon found.");
            res.status(200).send(enter_coupon);
        });
    });
});

// GET LIST enter coupon FROM USERID
router.get('/listEnterCoupon/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.find({user: req.params.id})
        //.populate('user')
        .exec(function (err, enter_coupon) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon.");
            if (!user) return res.status(404).send("No enter_coupon found.");
            res.status(200).send(enter_coupon);
        });
    });
});

// DELETES A enter_coupon FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, enter_coupon) {
            if (err) return res.status(500).send("There was a problem deleting the enter_coupon.");
            res.status(200).send("enter_coupon: " + enter_coupon.name + " was deleted.");
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
            date: req.body.date,
            user: req.body.user
        }, {
            new: true
        }, function (err, enter_coupon) {
            if (err) return res.status(500).send("There was a problem updating the enter_coupon.");
            res.status(200).send(enter_coupon);
        });
    });


});


module.exports = router;