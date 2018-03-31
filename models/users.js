var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    pass: String
});

var User = mongoose.model('User', userSchema);

// connect
var connect = function(callback) {
    mongoose.connect(require('../const').URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', callback);
};

var register = function(username, password, callback) {
    connect(() => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            User.create({
                username: username,
                pass: hash
            }, function(err, newUser) {
                if (err) callback(err, null);
                else callback(null, newUser);
            });
        });
    });
}

var findUser = function(username, callback) {
    connect(() => {
        User.findOne({ username: username.toLowerCase() }, function (err, user) {
            if (err) callback(err, null);
            else callback(null, user);
        });
    });
}

var findUserId = function(id, callback) {
    connect(() => {
        User.findById(id, function (err, user) {
            if (err) callback(err, null);
            else callback(null, user);
        });
    });
}

module.exports = {
    register: register,
    findUser: findUser,
    findUserId: findUserId
};
