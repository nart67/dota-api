# Test API for searching DotA 2 public games
This project collects DotA 2 match data from the OpenDota API into a locally hosted MongoDB instance and provides an API to display that data.  

Demo front end that consumes the API available [here](https://nart-dota-app.herokuapp.com/).  
Demo API can be accessed at https://nart-dota-api.herokuapp.com/

# Technology Used
ExpressJS, Node.js, MongoDB

# Current routes
* `/heroes` - Provides DotA 2 hero information
* `/search` - Searches the database for games
### Query parameters for /search
* hero - Required parameter. Hero ID to search games for
* opp - Optional parameter. Hero ID of opponent. This will search the database for games where the hero and opp are on opposing teams.
* loss - Optional parameter. Set to 1 to show games regardless of whether or not the hero won
* side - Optional parameter. (radiant|dire) This will filter results to games where the hero is on the specified side.

# ToDo/Bugs
* Add more search features
* Add favorite games system
