var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./enter_coupon_detail');
var User = require("../user/User");
var Coupon = require("../enter_coupon/enter_coupon");

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
                enter_coupon: req.body.enter_coupon,
                material: req.body.material,
                quantity: req.body.quantity,
                price: req.body.price,
                totalMoney: req.body.price * req.body.quantity
            },
            function (err, enter_coupon_detail) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);

                Coupon.findById(enter_coupon_detail.enter_coupon, function(err, enter_coupon){
                    if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);
                    if (!enter_coupon) return res.status(500).send("Can't find enter coupon");
                    console.log(enter_coupon);
                    enter_coupon.total = enter_coupon.total + enter_coupon_detail.totalMoney;
                    Coupon.update(enter_coupon, function(err, enter_coupon2){
                        if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);
                        res.status(200).send(enter_coupon_detail);    
                    });
                });

            });
    });
});

// RETURNS ALL THE enter_coupon_detail IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 2) return res.status(500).send("You not have permision");

        Entity.find({}).populate('material').populate('enter_coupon').exec(function (err, enter_coupon_detail) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon_detail. Error : "+err);
            if (!enter_coupon_detail) return res.status(404).send("Can't find enter coupon detail");
            res.status(200).send(enter_coupon_detail);
        });
    });

});

// GETS A SINGLE enter_coupon_detail FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 2)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id).populate('enter_coupon').populate("material").exec(function (err, enter_coupon_detail) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon_detail.");
            if (!enter_coupon_detail) return res.status(404).send("No enter_coupon_detail found.");
            res.status(200).send(enter_coupon_detail);
        });
    });
});

// GET LIST enter coupon FROM couponId
router.get('/listEnterCouponDetail/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 2)
            return res.status(500).send("You not have permision");

        Entity.find({
            enter_coupon: req.params.id
        }).populate('enter_coupon').populate('material').exec(function (err, enter_coupon_detail) {
            if (err) return res.status(500).send("There was a problem finding the enter_coupon_detail. Error : "+err);
            if (!enter_coupon_detail) return res.status(404).send("No enter_coupon_detail found.");
            res.status(200).send(enter_coupon_detail);
        });
    });
});

// DELETES A enter_coupon_detail FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type > 2)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id, function (err, enter_coupon_detail) {
            if (err) return res.status(500).send("There was a problem deleting the enter_coupon_detail.");

            Coupon.findById(enter_coupon_detail.enter_coupon, function(err, enter_coupon){
                if (err || !enter_coupon) return res.status(500).send("There was a problems deleting the enter coupon.");
                
                enter_coupon.total = enter_coupon.total - enter_coupon_detail.totalMoney;
                Coupon.update(enter_coupon, function(err, enter_coupon){
                    if (err || !enter_coupon) return res.status(500).send("There was a problems deleting the enter coupon.");
                    
                    Entity.deleteOne(enter_coupon_detail, function(err, enter_coupon_detail2){
                        if (err || !enter_coupon_detail2) res.status(500).send("There was a problems deleting the enter coupon detail");
                        res.status(200).send("enter_coupon_detail was deleted.");
                    });
                });
            });
            
            
        });
    });
});

// can not allow update detail coupon
// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
// router.put('/:id', VerifyToken, function (req, res, next) {

//     User.findById(req.userId, {
//         password: 0
//     }, function (err, user) {
//         if (err) return res.status(500).send("Token not correct");
//         if (!user) return res.status(404).send("Token not correct");

//         if (user.type != 1)
//             return res.status(500).send("You not have permision");

//         Entity.findByIdAndUpdate(req.params.id, {
//             enter_coupon: req.body.enter_coupon,
//             material: req.body.material,
//             quantity: req.body.quantity,
//             price: req.body.price,
//             totalMoney: req.body.quantity * req.body.price
//         }, {
//             new: true
//         }, function (err, enter_coupon_detail) {
//             if (err) return res.status(500).send("There was a problem updating the enter_coupon_detail.");
//             res.status(200).send(enter_coupon_detail);
//         });
//     });
// });


module.exports = router;