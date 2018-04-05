var express = require('express');
var router = express.Router();
var Favorite = require('../models/favorites').Favorite;

/* GET favorites listing. */
router.get('/', function(req, res) {
  user_id = req.user.id;
  Favorite.getFavorites(user_id, function(favorites) {
    if (favorites) res.status(200).json(favorites);
    else res.status(404).json({message: "Not found"});
  })
});

// Update favorite
router.put('/:id', function(req, res) {
  user_id = req.user.id;
  id = req.params.id;
  
  if (!req.body.favorite) {
    missing(res);
    return;
  }
  var newFavorite = JSON.parse(req.body.favorite);
  Favorite.updateFavorite(id, user_id, newFavorite, function(err) {
    if (err) res.status(404).json({message: "Not found"});
    else res.status(200).json({message: "Update successful"});
  })
});

// Delete favorite
router.delete('/:id', function(req, res) {
  user_id = req.user.id;
  id = req.params.id;
  Favorite.deleteFavorite(id, user_id, function(err, favorite) {
    if (err || !favorite) res.status(404).json({message: "Not found"});
    else res.status(200).json({message: "Delete successful"});
  })
});

// Create favorite
router.post('/', function(req, res) {
  if (!req.body.game_id) {
    missing(res);
    return;
  }
  var newFavorite = new Favorite({
    user_id: req.user.id,
    game_id: req.body.game_id,
    comment: req.body.comment
  });
  newFavorite.save(function(err) {
    if (err) res.status(409).json({message: "Add failed"});
    else res.status(201).json({message: "Add successful", favorite: newFavorite});
  })
});

function missing(res) {
  res.status(400).json({message: "Missing information"});
}

module.exports = router;
