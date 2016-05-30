var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	value: String,
	code: Number
},{
	timestamps: true
});

var Category = mongoose.model('Category',categorySchema);

module.exports = Category;