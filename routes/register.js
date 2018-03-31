var express = require('express');
var router = express.Router();
var users = require('../models/users');
var bcrypt = require('bcrypt');

router.post("/", function (req, res) {
    if (req.body.name && req.body.password) {
        var name = req.body.name.toLowerCase();
        var password = req.body.password;
    
        users.register(name, password, function(err, newUser) {
            if (err) {
                res.status(401).json({
                    message:"Registration error"
                });
            } else {
                res.status(201).json({
                    message:"User registered",
                    user: newUser.username
                });
            }
        });
    } else {
        res.status(401).json({message:"missing username or password"});
    }
});

module.exports = router;