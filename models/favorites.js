var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    game_id: {type: Schema.Types.ObjectId, ref: 'Game'},
    comment: String,
    date_saved: Date
});

var gameSchema = require('./games').gameSchema;
var userSchema = require('./users').userSchema;

var Game = mongoose.model('Game', gameSchema);
var User = mongoose.model('User', userSchema);

favoriteSchema.statics.updateFavorite = function(id, user_id, newFavorite, callback) {
    this.findById(id, function(err, favorite) {
        if (err) {
            callback(err);
            return;
        }
        
        if (!favorite) {
            callback(new Error("not found"));
            return;
        }

        if (!favorite.user_id.equals(user_id)) {
            callback(new Error("unauthorized"));
            return;
        }

        if (newFavorite.game_id) favorite.game_id = newFavorite.game_id;
        favorite.comment = newFavorite.comment;

        favorite.save(function(err) {
            if (err) callback(err);
            else callback(null);
        });
    })
}

favoriteSchema.statics.deleteFavorite = function(id, user_id, callback) {
    this.findById(id, function(err, favorite) {
        if (err) {
            callback(err);
            return;
        }

        if (!favorite) {
            callback(new Error("not found"));
            return;
        }
        
        if (!favorite.user_id.equals(user_id)) {
            callback(new Error("unauthorized"));
            return;
        }

        favorite.remove(function(err, removed) {
            if (err) callback(err, null);
            else callback(null, removed);
        });
    })
}

favoriteSchema.statics.getFavorites = function(user_id, callback) {
    this.find({user_id: user_id}, null, {sort: {date_saved: -1}})
        .populate('game_id')
        .exec(function(err, favorites) {
        if (err) {
            console.log(err);
            return;
        }
        callback(favorites);
    });
}

favoriteSchema.pre('save', function(next) {
    this.date_saved = Date.now();
    next();
});

var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = {
    Favorite: Favorite,
    favoriteSchema: favoriteSchema
}