var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	code: String,
	name: String,
  tournament: String
});

var Country = mongoose.model('Country',objectSchema);

module.exports = Country;
