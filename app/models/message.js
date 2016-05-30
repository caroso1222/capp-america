var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	text: String,
	type: String,
	reach: Number
},{
	timestamps: true
});

var Message = mongoose.model('Message',objectSchema);

module.exports = Message;