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

module.exports = {
    gameSchema: gameSchema
}