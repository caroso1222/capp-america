var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requirementSchema = new Schema({
	description: String,
	design_hours: Number,
	frontend_hours: Number,
	backend_hours: Number,
	integration_hours: Number,
	//category: [{type:Schema.Types.ObjectId, ref: 'Category'}]
	category: Number
},{
	timestamps: true
});

var Requirement = mongoose.model('Requirement',requirementSchema);

module.exports = Requirement;