var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    match_id: Number,
    radiant_win: Boolean,
    start_time: Number,
    duration: Number,
    avg_mmr: Number,
    radiant_team: [Number],
    dire_team: [Number]
});

gameSchema.statics.search = function(searchQuery, callback) {
    this.find(searchQuery, null, {sort: {start_time: -1}}, (err, games) => {
        if (err) {
            callback(err, null);
        }
        callback(null, games);
    });
}

gameSchema.statics.mostRecent = function(callback) {
    this.find({}, null, {sort: {start_time: -1}, limit: 1}, (err, games) => {
        if (err) {
            callback(err, null);
        }
        callback(null, games);
    });
}

var Game = mongoose.model('Game', gameSchema);

module.exports = {
    Game: Game,
    gameSchema: gameSchema
}