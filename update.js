var express = require('express');
var url = require('./const');
var mongo = require('mongodb').MongoClient
var request = require('request');

var update = function updater() {
    mongo.connect(url, function(err, db) {
        const myDb = db.db('dota2matchup');
        if (err) throw err;
        myDb.collection('games', function(err, collection) {
            if (err) throw err;
            collection.find().sort({start_time:-1}).limit(1).toArray(function(err, result) {
                if (err) throw err;
                var start = 0;
                if (result[0] != undefined) start = result[0].start_time; 
                timer(start);
            });

            db.close();
        });
    });
};

function timer(start) {

    setTimeout(function() {
        var sql = encodeURIComponent(
            `SELECT m.match_id, radiant_win, start_time, duration, avg_mmr, player_slot, hero_id
            FROM public_matches m
            JOIN public_player_matches p ON p.match_id = m.match_id
            WHERE m.avg_mmr > 6000
            AND start_time > ` + start + 
            ` ORDER BY m.start_time ASC
            LIMIT 100`
        )

        request({
            uri: 'https://api.opendota.com/api/explorer?sql=' + sql,
            method: 'GET'
        }, function(err, res, body) {
            if (err) throw err;
            if (res.headers['content-type'].includes('application/json')) getGames(body);
            else timer(start);
        });
    }, 10000, start);

}

function insert(data) {
    mongo.connect(url, function(err, db) {
        const myDb = db.db('dota2matchup');
        if (err) throw err;
        myDb.collection('games', function(err, collection) {
            if (err) throw err;
            collection.insertMany(data, function(err, records) {
                if (err) throw err;
                db.close();
            });
        });
    });
}

// Sort response into game object
function getGames(body) {
    let json = JSON.parse(body);
    var game = { };
    var games = [];
    for (let i = 0; i < json.rows.length; i++) {
        let row = json.rows[i];
        if (row.match_id != game.match_id) {
            game = {
                match_id: row.match_id,
                radiant_win: row.radiant_win,
                start_time: row.start_time,
                duration: row.duration,
                avg_mmr: row.avg_mmr,
                radiant_team: [],
                dire_team: []
            }
        }
        if (row.player_slot < 100) game.radiant_team.push(row.hero_id);
        else game.dire_team.push(row.hero_id);
        if (game.radiant_team.length == 5
            && game.dire_team.length == 5) games.push(game);
    }
    insert(games);
    timer(game.start_time);
}

module.exports = update;