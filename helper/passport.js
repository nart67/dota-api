var ExtractJwt = require('passport-jwt').ExtractJwt,
    JwtStrategy = require('passport-jwt').Strategy;
var User = require('../models/users').User;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET; // Add secret in env

var strategy = new JwtStrategy(jwtOptions,
    function(jwt_payload, next) {
    
    User.findUserId(jwt_payload.id, function(err, user) {
        if (err) {
            console.log(err);
            next(null, false);
        }
        else {
            if (user && user.id === jwt_payload.id) {
                next(null, user);
            } else {
                next(null, false);
            }
        }
    })
});

module.exports = {
    strategy: strategy
};