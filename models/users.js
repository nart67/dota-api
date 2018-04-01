var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    pass: String
});

userSchema.statics.register = function(username, password, callback) {
    var users = this;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        var user = new users({
            username: username,
            pass: hash
        });
        user.save(function(err, newUser) {
            if (err) callback(err, null);
            else callback(null, newUser);
        });
    });
}

userSchema.statics.findUser = function(username, callback) {
    User.findOne({ username: username.toLowerCase() }, function (err, user) {
        if (err) callback(err, null);
        else callback(null, user);
    });
}

userSchema.statics.findUserId = function(id, callback) {
    User.findById(id, function (err, user) {
        if (err) callback(err, null);
        else callback(null, user);
    });
}

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User,
    userSchema: userSchema
};
