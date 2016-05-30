var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourceSchema = new Schema({
	name: String,
	time_percentage: Number,
	wage: Number
},{
	timestamps: true
});

var Resource = mongoose.model('Resource',resourceSchema);

module.exports = Resource;