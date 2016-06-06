var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config_params = require('./config/params');

if (config_params.environment == config_params.DEVELOPMENT){
	var db = require('./config/db.development');
}else{
	var db = require('./config/db.production');
}

//Setting up database connection on mlab
var initApp = function(){
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.set('view engine', 'ejs');
	app.listen(10909);
	require('./app/routes/admin.routes')(app);
	require('./app/routes/bot.routes')(app);
	require('./app/routes/user.routes')(app);
	require('./app/routes/api.routes')(app);
	console.log("server running on port 10909");
}

mongoose.connect(db.uri, db.options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));  
db.once('open', initApp);


//https://13f1be76.ngrok.io