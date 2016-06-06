var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	team_1: String,
	team_2: String,
	team_1_score: Number,
	team_2_score: Number,
	penalties: String
});

var Score = mongoose.model('Score',objectSchema);

module.exports = Score;