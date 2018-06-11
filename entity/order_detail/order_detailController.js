var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./order_detail');
var User = require("../user/User");
var Order = require("../order/order");
var Product = require("../product/product");

// // CREATES A NEW product
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 3)
            return res.status(500).send("You not have permision");

        Product.findById(req.body.product, function (err, product) {
            if (err) return res.status(500).send("Product not correct");
            if (!product) return res.status(404).send("Product not exist");

            Entity.create({
                    order: req.body.order,
                    product: req.body.product,
                    quantity: req.body.quantity,
                    price: product.price,
                    totalMoney: product.price * req.body.quantity
                },
                function (err, order_detail) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);

                    Order.findById(order_detail.order, function (err, order) {
                        if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);
                        if (!order) return res.status(500).send("Can't find enter order");

                        order.total = order.total + order_detail.totalMoney;

                        Order.findByIdAndUpdate(order_detail.order, order, function (err, order2) {
                            if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);
                            res.status(200).send(order_detail);
                        });
                    });
                });
        });


    });
});

// RETURNS ALL THE order_detail IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1) return res.status(500).send("You not have permision");

        Entity.find({}).populate('product').populate('order').exec(function (err, order_detail) {
            if (err) return res.status(500).send("There was a problem finding the order_detail. Error : " + err);
            if (!order_detail) return res.status(404).send("Can't find enter order detail");
            res.status(200).send(order_detail);
        });
    });

});

// GETS A SINGLE order_detail FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 3)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id).populate('order').populate("product").exec(function (err, order_detail) {
            if (err) return res.status(500).send("There was a problem finding the order_detail.");
            if (!order_detail) return res.status(404).send("No order_detail found.");
            res.status(200).send(order_detail);
        });
    });
});

// GET LIST enter order FROM OrderID
router.get('/ListOrderDetail/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 3)
            return res.status(500).send("You not have permision");

        Entity.find({
            order: req.params.id
        }).populate('order').populate('product').exec(function (err, order_detail) {
            if (err) return res.status(500).send("There was a problem finding the order_detail. Error : " + err);
            if (!order_detail) return res.status(404).send("No order_detail found.");
            res.status(200).send(order_detail);
        });
    });
});

// DELETES A order_detail FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 3)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id, function (err, order_detail) {
            if (err) return res.status(500).send("There was a problem deleting the order_detail. Error : " + err);

            Order.findById(order_detail.order, function (err, order) {
                if (err || !order) return res.status(500).send("There was a problems deleting the enter order. Error: " + err);

                order.total = order.total - order_detail.totalMoney;
                Order.findByIdAndUpdate(order_detail.order, order, function (err, order2) {
                    if (err || !order2) return res.status(500).send("There was a problems deleting the order detail. Error: " + err);

                    Entity.deleteOne(order_detail, function (err, order_detail2) {
                        if (err || !order_detail2) res.status(500).send("There was a problems deleting the enter order detail");
                        res.status(200).send("order_detail was deleted.");
                    });
                });
            });
        });
    });
});

// Update a order detail
// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', VerifyToken, function (req, res, next) {

    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 3)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id, function (err, order_detail) {
            if (err) return res.status(500).send("Can't not find Order Detail");
            if (!order_detail) return res.status(404).send("Can't not find Order detail.");

            var oldMoney = order_detail.totalMoney;

            Entity.findByIdAndUpdate(req.params.id, {
                quantity: req.body.quantity,
                price: order_detail.price,
                totalMoney: req.body.quantity * order_detail.price
            }, {
                new: true
            }, function (err, order_detail2) {
                if (err || !order_detail2) return res.status(500).send("There was a problem updating the order_detail.");

                Order.findById(order_detail2.order, function (err, order) {
                    if (err || !order) return res.status(404).send("Can't find Order");

                    order.total = order.total - oldMoney + order_detail2.totalMoney;
                    Order.findByIdAndUpdate(order_detail2.order, order, function (err, order2) {
                        if (err || !order2) return res.status(500).send("There was a problems update the order. Error: " + err);
                        res.status(200).send(order_detail2);
                    });

                });
            });
        });
    });
});

module.exports = router;