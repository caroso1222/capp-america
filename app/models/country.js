var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Score = new Schema({
	team_1  : String,
	team_2  : Number,
	score_1 : String,
	score_2 : Number,
	penalties : String
});

var objectSchema = new Schema({
	code: String,
	name: String,
	scores: [Score]
});

var Country = mongoose.model('Country',objectSchema);

module.exports = Country;