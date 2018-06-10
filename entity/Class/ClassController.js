var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Class = require('./Class');

// CREATES A NEW USER
router.post('/', function (req, res) {
    Class.create({
            name : req.body.name,
            type: req.body.type
        }, 
        function (err, Class) {
            if (err) return res.status(500).send("There was a problem adding the Class information to the database.");
            res.status(200).send(Class);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    Class.find({}, function (err, Classs) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(Classs);
    });
});

module.exports = router;