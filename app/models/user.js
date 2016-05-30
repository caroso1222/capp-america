var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	name: String,
	lastname: String,
	user_id: String,
	last_message: String,
	status: String //undefined, subscribed or unsubscribed
},{
	timestamps: true
});

var User = mongoose.model('User',objectSchema);

module.exports = User;