var express = require('express');
var url = 'mongodb://localhost:27017/';
var mongo = require('mongodb').MongoClient
var router = express.Router();

/* GET search. */
router.get('/', function(req, res, next) {
    let hero = parseInt(req.query.hero);
    console.log(hero)
    if (hero > 120 || hero < 1 ) res.status(500).send('Invalid Hero');
    mongo.connect(url, function(err, db) {
        const myDb = db.db('dota2matchup');
        if (err) throw err;
        myDb.collection('games', function(err, collection) {
            if (err) throw err;
            collection.find(
                {
                    $or: [
                        { radiant_team: hero },
                        { dire_team: hero }
                    ]
                }
            ).toArray(function(err, data) {
                if (err) throw err;
                res.send(data);
                db.close();
            })
        })
    });         
});

module.exports = router;