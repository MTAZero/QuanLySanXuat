var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var md5 = require('md5');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./product');
var User = require("../user/User");

// // CREATES A NEW product
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
                note: req.body.note,
                imageUrl: "",
                price: req.body.price,
                expiry: req.body.expiry
            },
            function (err, product) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(product);
            });
    });
});

// RETURNS ALL THE product IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({}, function (err, product) {
            if (err) return res.status(500).send("There was a problem finding the product.");
            res.status(200).send(product);
        });
    });

});

// GETS A SINGLE product FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id, function (err, product) {
            if (err) return res.status(500).send("There was a problem finding the product.");
            if (!user) return res.status(404).send("No product found.");
            res.status(200).send(product);
        });
    });
});

// DELETES A product FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, product) {
            if (err) return res.status(500).send("There was a problem deleting the product.");
            res.status(200).send("product: " + product.name + " was deleted.");
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
            note: req.body.note,
            price: req.body.price,
            expiry: req.body.expiry,
            imageUrl: ""
        }, {
            new: true
        }, function (err, product) {
            if (err) return res.status(500).send("There was a problem updating the product.");
            res.status(200).send(product);
        });
    });


});


module.exports = router;