var ExtractJwt = require('passport-jwt').ExtractJwt,
    JwtStrategy = require('passport-jwt').Strategy;
var Users = require('../models/users');

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET; // Add secret in env

var strategy = new JwtStrategy(jwtOptions,
    function(jwt_payload, next) {
    
    Users.findUserId(jwt_payload.id, function(err, user) {
        if (err) {
            console.log(err);
            next(null, false);
        }
        else {
            if (user.id === jwt_payload.id) {
                next(null, user);
            }
        }
    })
});

module.exports = {
    strategy: strategy
};