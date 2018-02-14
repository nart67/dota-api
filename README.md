# Test API for searching DotA 2 public games
This project collects DotA 2 match data from the OpenDota API into a locally hosted MongoDB instance and provides an API to display that data.

# Technology Used
ExpressJS, Node.js, MongoDB

# Current routes
* `/heroes` - Provides DotA 2 hero information
* `/search` - Searches the database for games
### Query parameters
* hero - Required parameter. Hero ID to search games for
* opp - Optional parameter. Hero ID of opponent. This will search teh database for games where the hero and opp are on opposing teams.

# ToDo/Bugs
* Fix duplicate games being inserted
* Add more search features

