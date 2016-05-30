var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
	name: String,
	value: Number
},{
	timestamps: true
});

var Constant = mongoose.model('Constant',modelSchema);

module.exports = Constant;