var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
var Entity = require('./work_progress');
var User = require("../user/User");

// // CREATES A NEW work_progress
router.post('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        "password": 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 3) return res.status(500).send("You not have permission");

        Entity.create({
                date: req.body.date,
                percent: req.body.percent,
                note: req.body.note,
                order: req.body.order,
                employee: req.userId
            },
            function (err, work_progress) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. Error : " + err);
                res.status(200).send(work_progress);
            });
    });
});

// RETURNS ALL THE work_progress IN THE DATABASE
router.get('/', VerifyToken, function (req, res) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 3) return res.status(500).send("You not have permision");

        Entity.find({})
            //.populate("employee")
            .exec(function (err, work_progress) {
                if (err) return res.status(500).send("There was a problem finding the work_progress.");
                res.status(200).send(work_progress);
            });
    });

});

// GETS A SINGLE work_progress FROM THE DATABASE
router.get('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 3)
            return res.status(500).send("You not have permision");

        Entity.findById(req.params.id)
            //.populate('employee')
            .exec(function (err, work_progress) {
                if (err) return res.status(500).send("There was a problem finding the work_progress.");
                if (!user) return res.status(404).send("No work_progress found.");
                res.status(200).send(work_progress);
            });
    });
});

// GET LIST work progress FROM orderID
router.get('/ListWorkProgress/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 3)
            return res.status(500).send("You not have permision");

        Entity.find({
                order: req.params.id
            })
            //.populate('employee')
            .exec(function (err, work_progress) {
                if (err) return res.status(500).send("There was a problem finding the work_progress.");
                if (!user) return res.status(404).send("No work_progress found.");
                res.status(200).send(work_progress);
            });
    });
});

// DELETES A work_progress FROM THE DATABASE
router.delete('/:id', VerifyToken, function (req, res, next) {
    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type != 1)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndRemove(req.params.id, function (err, work_progress) {
            if (err) return res.status(500).send("There was a problem deleting the work_progress.");
            res.status(200).send("work_progress: " + work_progress.name + " was deleted.");
        });
    });
});

// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', VerifyToken, function (req, res, next) {

    User.findById(req.userId, {
        password: 0
    }, function (err, user) {
        if (err) return res.status(500).send("Token not correct");
        if (!user) return res.status(404).send("Token not correct");

        if (user.type == 3)
            return res.status(500).send("You not have permision");

        Entity.findByIdAndUpdate(req.params.id, {
            date: req.body.date,
            percent: req.body.percent,
            note: req.body.note,
            order: req.body.order,
            employee: req.userId
        }, {
            new: true
        }, function (err, work_progress) {
            if (err) return res.status(500).send("There was a problem updating the work progress.");
            res.status(200).send(work_progress);
        });
    });

});

module.exports = router;