var express = require('express');
var router = express.Router();
var users = require('../models/users');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

router.post("/", function (req, res) {
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;
    
        users.findUser(name, function(err, user) {
            if (err || !user) {
                res.status(401).json({message:"no such user found"});
                return;
            }
            verify(user, password, res);
        });
    } else {
        res.status(401).json({message:"missing username or password"});
    }
});

function verify(user, password, res) {
    bcrypt.compare(password, user.pass, function(err, comparison) {
        if (err) console.log(err);
        if (comparison) {
            var payload = {id: user.id};
            var token = jwt.sign(payload, process.env.SECRET);
            res.json({message: "ok", token: token});
        } else {
            res.status(401).json({message:"passwords did not match"});
        }
    });
}

module.exports = router;