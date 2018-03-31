var ExtractJwt = require('passport-jwt').ExtractJwt,
    JwtStrategy = require('passport-jwt').Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET; // Add secret in env

var users = [
    {
      id: 1,
      name: 'test',
      password: 'test'
    }
  ];

var strategy = new JwtStrategy(jwtOptions,
    function(jwt_payload, next) {
    // Enter database call here
    console.log('payload received', jwt_payload);
    
    if (users[0].id === jwt_payload.id) {
        next(null, users[0]);
    } else {
        next(null, false);
    }
});

module.exports = {
    strategy: strategy,
    users: users
};