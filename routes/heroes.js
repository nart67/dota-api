var express = require('express');
var url = require('../const')
var mongo = require('mongodb').MongoClient
var router = express.Router();

/* GET search. */
router.get('/', function(req, res, next) {
    mongo.connect(url, function(err, db) {
        const myDb = db.db('dota2matchup');
        if (err) throw err;
        myDb.collection('heroes', function(err, collection) {
            if (err) throw err;
            collection.find().sort(
                { localized_name: 1 }
            ).toArray(function(err, data) {
                if (err) throw err;
                res.set('Access-Control-Allow-Origin', '*');
                res.send(data);
                db.close();
            })
        });
    })  
});

module.exports = router;