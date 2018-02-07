var express = require('express');
var url = 'mongodb://localhost:27017/';
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
                    searchQuery(hero, opp)
                ).toArray(function(err, data) {
                    if (err) throw err;
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
function searchQuery(hero, opp) {
    if (Number.isNaN(opp)) {
        return {
            $or: [
                { radiant_team: hero },
                { dire_team: hero }
            ]
        };
    }
    return {
        $or: [
            { $and: [{ radiant_team: hero }, { dire_team: opp }] },
            { $and: [{ dire_team: hero }, { radiant_team: opp }] }
        ]
    };
}

module.exports = router;