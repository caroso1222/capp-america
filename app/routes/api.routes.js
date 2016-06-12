var Country = require('../models/country');
var Score = require('../models/score');
var Tournament = require('../models/tournament');
var User = require('../models/user');

var routes = function(app){
	app.get('/api',function(req,res){
		res.render('pages/admin');
	});

	app.post('/api/score',function(req,res){
		var newScore = new Score(req.body);
		newScore.save(function(err,obj){
			if(err) return res.send(500, {error:err});
			return res.send("sucessfully saved");
		});
	});

	app.get('/api/scores',function(req,res){
		Score.find(function (err,elems) {
			if(err) return console.log(err);
			res.send(elems);
		})
	});

	app.get('/api/tournaments',function(req,res){
		Tournament.find(function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		})
	});

	app.get('/api/countries/:tournament',function(req,res){
		Country.find({'tournament':req.params.tournament},function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		})
	});

	app.get('/api/countries',function(req,res){
		Country.find(function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		})
	});

	app.post('/api/country',function(req,res){
		var newCountry = new Country(req.body);
		newCountry.save(function(err,obj){
			if(err) return res.send(500, {error:err});
			return res.send("sucessfully saved");
		})
	});

	app.get('/requirements',function(req,res){
		Requirement.find(function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		});
	});

	app.post('/resource',function(req,res){
		var newResource = new Resource(req.body);
		newResource.wage = 0;
		newResource.save(function(err,obj){
			if(err) return console.log(err);
		});
	});

	app.get('/resources',function(req,res){
		Resource.find(function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		});
	});

	app.put('/resource/:id',function(req,res){
		var id = req.params.id;
		Resource.findOneAndUpdate({'_id':id},req.body, function(err,doc){
			if(err) return res.send(500, {error:err});
			return res.send("sucessfully saved");
		});
	});

	app.post('/constant',function(req,res){
		var elem = new Constant(req.body);
		elem.save(function(err,obj){
			if(err) return console.log(err);
		});
	});

	app.get('/constants',function(req,res){
		Constant.find(function(err,elems){
			if(err) return console.log(err);
			res.send(elems);
		});
	});

	app.get('/updateUsers',function(req,res){
		User.update({},{last_message:"none",tournaments:[]},{multi:true},(err,raw)=>{
		console.log(raw)
			if(err) return res.send(500, {error:err});
			return res.send(raw);
		})
	});

	app.get('/updateUsersTournaments',function(req,res){
		User.update({status:'subscribed'},{tournaments:['AMERICA']},{multi:true},(err,raw)=>{
		console.log(raw)
			if(err) return res.send(500, {error:err});
			return res.send(raw);
		})
	});

	app.put('/constant/:id',function(req,res){
		var id = req.params.id;
		Constant.findOneAndUpdate({'_id':id},req.body, function(err,doc){
			if(err) return res.send(500, {error:err});
			return res.send("sucessfully saved");
		});
	});
}

module.exports = routes;
