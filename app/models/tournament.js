var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	code: String,
	name: String
});

var Tournament = mongoose.model('Tournament',objectSchema);

module.exports = Tournament;
