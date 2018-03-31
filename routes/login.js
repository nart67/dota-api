var express = require('express');
var router = express.Router();
var users = require('../helper/passport').users;
var jwt = require('jsonwebtoken');

router.post("/", function (req, res) {
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;
    }
    // insert database call here
    if (users[0].name !== name) {
        res.status(401).json({message:"no such user found"});
        return;
    }

    // replace with crypto algorithm later
    if (users[0].password === req.body.password) {
        var payload = {id: users[0].id};
        var token = jwt.sign(payload, process.env.SECRET);
        res.json({message: "ok", token: token});
    } else {
        res.status(401).json({message:"passwords did not match"});
    }
});

module.exports = router;