var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./product_material');
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
                product: req.body.product,
                material: req.body.material,
                quantity: req.body.quantity
            },
            function (err, product_material) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(product_material);
            });
    });
});

// RETURNS ALL THE product_material IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({}).populate("product").populate("material").exec(function (err, product_material) {
            if (err) return res.status(500).send("There was a problem finding the product_material.");
            res.status(200).send(product_material);
        });
    });

});

// GETS A SINGLE product_material FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id).populate('product').populate('material').exec(function (err, product_material) {
            if (err) return res.status(500).send("There was a problem finding the product_material.");
            if (!user) return res.status(404).send("No product_material found.");
            res.status(200).send(product_material);
        });
    });
});

// GET LIST MATERIAL FROM PRODUCT ID
router.get('/listmaterial/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1 && req.userId != req.params.id)
            return res.status(500).send("You not have permision");

        Entity.find({product: req.params.id}).populate('product').populate('material').exec(function (err, product_material) {
            if (err) return res.status(500).send("There was a problem finding the product_material.");
            if (!user) return res.status(404).send("No product_material found.");
            res.status(200).send(product_material);
        });
    });
});

// DELETES A product_material FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, product_material) {
            if (err) return res.status(500).send("There was a problem deleting the product_material.");
            res.status(200).send("product_material: " + product_material.name + " was deleted.");
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
            product: req.body.product,
            material: req.body.material,
            quantity: req.body.quantity
        }, {
            new: true
        }, function (err, product_material) {
            if (err) return res.status(500).send("There was a problem updating the product_material.");
            res.status(200).send(product_material);
        });
    });


});


module.exports = router;