var Category = require('../models/category');
var Requirement = require('../models/requirement');

var routes = function(app){
	app.get('/',function(req,res){
		res.render('pages/user');
	});
}


module.exports = routes;

