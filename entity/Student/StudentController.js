var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var entitys = require('./Student');

// CREATES A NEW USER
router.post('/', function (req, res) {
    entitys.create({
            name : req.body.name,
            dob: req.body.dob,
            class: req.body.class
        }, 
        function (err, entity) {
            //console.log(err);
            if (err) return res.status(500).send("There was a problem adding the student information to the database.");
            res.status(200).send(entity);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    entitys.find({}).populate('class','name').exec(function (err, entity) {
        if (err) return res.status(500).send("There was a problem finding the student.");
        res.status(200).send(entity);
    });
});

module.exports = router;