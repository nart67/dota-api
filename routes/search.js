var express = require('express');
var url = require('../const');
var mongo = require('mongodb').MongoClient
var router = express.Router();

/* GET search. */
router.get('/', function(req, res, next) {
    let hero = parseInt(req.query.hero);
    let opp = parseInt(req.query.opp);
    if (validate(hero, opp)) {
        res.status(500).send('Invalid Hero');
    }
    else {
        mongo.connect(url, function(err, db) {
            const myDb = db.db('dota2matchup');
            if (err) throw err;
            myDb.collection('games', function(err, collection) {
                if (err) throw err;
                collection.find(
                    searchQuery(hero, opp, req.query.loss, req.query.side)
                ).sort({ start_time: -1 }).toArray(function(err, data) {
                    if (err) throw err;
                    res.set('Access-Control-Allow-Origin', '*');
                    res.send(data);
                    db.close();
                })
            })
        });
    }  
});

//Helper function to validate input
function validate(hero, opp) {
    if (hero > 120 || hero < 1 || Number.isNaN(hero) ||
        opp > 120 || opp < 1) return true;
    return false;
}

//Make search query based on input
function searchQuery(hero, opp, loss, side) {
    let radiant = {};
    let dire = {};
    loss = parseInt(loss);

    radiant.radiant_team = hero;
    dire.dire_team = hero;

    if (!Number.isNaN(opp)) {
        radiant.dire_team = opp;
        dire.radiant_team = opp;
    }

    if (loss !== 1) {
        radiant.radiant_win = true;
        dire.radiant_win = false;
    }

    if (side === "radiant") {
        return radiant;
    }
    else if (side === "dire") {
        return dire;
    }
    return {
        $or: [radiant, dire]
    };
}

module.exports = router;