'use strict'

var User = require('../models/user');
var Message = require('../models/message');
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('messenger-bot');

var config_params = require('../../config/params');

if (config_params.environment == config_params.DEVELOPMENT){
	var bot_config = require('../../config/bot.development');
}else{
	var bot_config = require('../../config/bot.production');
}

let bot = new Bot({
	token: bot_config.token,
	verify: bot_config.verify
})


bot.on('error', (err) => {
	console.log(err.message)
})


bot.on('message', (payload, reply) => {
	let text = payload.message.text
	getUser(payload.sender.id,function(err,user){
		if(user){
			// If the user exists in the database 	
			var reply_text = {text:"empty"};
			if(user.last_message == 'prompt'){
				//If the last message sent to the user is asking for notification permissions, this should be the answer to that question
				if(identifyPositive(text)){
					User.findOneAndUpdate({'user_id':payload.sender.id},{'last_message':'suscription_confirmation','status':'subscribed'}, function(err,doc){
						if(err){
							reply_text = {text:'No pudimos agregarte a nuestra lista de suscritos'}
						}else{
							reply_text = {text:'¡Perfecto! Ya quedaste suscrito a todas las notificaciones de goles y resultados finales de partidos.'}
						}
						replyMessage(reply,reply_text);
					});
				}else if(identifyNegative(text)){
					User.findOneAndUpdate({'user_id':payload.sender.id},{'last_message':'no_suscription_confirmation','status':'undefined'}, function(err,doc){
						if(err){
							reply_text = {text:'No pudimos eliminarte de nuestra lista de suscritos'}
							//return res.send(500, {error:err});
						}else{
							reply_text = {text:'Está bien. No te molestaré con notificaciones. Recuerda que puedes saludarme otra vez cuando quieras recibir notificaciones de la Copa América Centenario.'}
						}
						replyMessage(reply,reply_text);
					});
				}else{
					reply_text = {text:'Por favor responde Si o No pues es lo único que puedo entender. ¿Deseas suscribirte a mis notificaciones?'}
				}
			}else if(user.last_message == 'suscription_confirmation'){
				//If the last message is suscription confirmation, perhaps the user is thanking
				User.findOneAndUpdate({'user_id':payload.sender.id},{'last_message':'none'}, function(err,doc){
					if(identifyGratefulness(text)){
						reply_text = {text:':D Ahora sí, a disfrutar esta Copa América ' + user.name +"!"}
					}else{
						reply_text = {text:'No entiendo lo que me dices '+user.name+', pero por favor disfruta mucho esta Copa América!'}
					}
					replyMessage(reply,reply_text);
				});
			}else if(user.last_message == 'no_suscription_confirmation'){
				//If the last message is suscription confirmation, perhaps the user is thanking
				User.findOneAndUpdate({'user_id':payload.sender.id},{'last_message':'none'}, function(err,doc){
					if(identifyGratefulness(text)){
						reply_text = {text:'Vale :(. Igual te voy a extrañar '+user.name+'.'}
					}else{
						reply_text = {text:'No entiendo lo que me dices '+user.name+', pero espero me disculpes si fueron molestas para ti las notificaciones.'}
					}
					replyMessage(reply,reply_text);
				});
			}else{
				//The user is sending random messages. 
				//IF SOME AI FUNCTIONALITY IS TO BE IMPLEMENTED, THIS IS THE PLACE TO DO IT
				var prompt = 'No entiendo lo que me dices '+user.name+'. ¿Quieres seguir recibiendo las notificaciones de esta Copa América?.'
				user.last_message = 'prompt';
				user.save(function(err,obj){
					if (err){
						reply_text = {text:'Ups me chispotié. Algo salió mal.'};
						replyMessage(reply,reply_text);
					}
					var reply_payload = {
						'attachment':{
							type: 'template',
							payload: {
								'template_type':'button',
								'text':prompt,
								'buttons':[
								{
									'type':'postback',
									'title':'Si',
									'payload':'Yes'
								},
								{
									'type':'postback',
									'title':'No',
									'payload':'No'
								}
								]
							}
						}
					}
					reply(reply_payload, function(err){
						if (err) return console.log(err);
					});
				});
			}
			if(reply_text.text!='empty'){
				console.log('trying to send this message: ');
				console.log(reply_text);
				reply(reply_text, function(err){
					if (err) return console.log(err);
				});
			}
		}else{ 	
			// If the user doesn't exists in the database get the incoming data and show first prompt
			bot.getProfile(payload.sender.id, (err, profile) => {
				if (err) {return console.log(err); }
				let greeting = 'Hola '+ profile.first_name + '! Soy un bot apasionado por el fútbol. ¿Me autorizas a enviarte notificaciones de todo lo que pase en la Copa América Centenario?';
				var reply_payload = {
					'attachment':{
						type: 'template',
						payload: {
							'template_type':'button',
							'text':greeting,
							'buttons':[
							{
								'type':'postback',
								'title':'Si',
								'payload':'Yes'
							},
							{
								'type':'postback',
								'title':'No',
								'payload':'No'
							}
							]
						}
					}
				}
				reply(reply_payload, (err) => {
					if (err){ return console.log(err);}

					//Adds new user to the database
					var user = {
						name:profile.first_name,
						lastname:profile.last_name,
						user_id:payload.sender.id,
						status:'undefined', //when a user is added it's not unsubscribed nor subscribed					
						last_message:'prompt'
					}
					addUser(user, function(err,obj){
						if(err){return console.log(err);}
						console.log('New user added to DB: '+obj.name + " "+obj.lastname);
					});
					
				})
			});
}
});
})

//Postback called when showing the notification permission prompt
bot.on('postback', (payload, reply) => {
	var reply_text = "";
	if(payload.postback.payload == 'Yes'){
		User.findOne({user_id:payload.sender.id},function(err,user){ //Looks for the user in the DB
			if(err){
				return console.log("there was an error");
			}
			if (user.status != 'subscribed'){  //Only subscribe unsubscribed users
				user.last_message='suscription_confirmation';
				user.status = 'subscribed';
				user.save(function(err,obj){
					if (err){
						reply_text = {text:'No pudimos agregarte a nuestra lista de suscritos'}
					}else{
						reply_text = {text:'¡Perfecto! Ya quedaste suscrito a todas las notificaciones de goles y resultados finales de partidos.'}
					}
					replyMessage(reply,reply_text);
				});
			}else{
				user.last_message='suscription_confirmation';
				user.status = 'subscribed';
				user.save(function(err,obj){
					if (err){
						reply_text = {text:'No pudimos agregarte a nuestra lista de suscritos'}
					}else{
						reply_text = {text:'Parece que ya estabas registrado para recibir las notificaciones. ¡Sigue disfrutando de lo mejor de esta Copa América!'}
					}
					replyMessage(reply,reply_text);
				});
			}
		});
}else{
		User.findOne({user_id:payload.sender.id},function(err,user){ //Looks for the user in the DB
			if(err){
				reply_text = {text:'No pudimos eliminarte de nuestra lista de suscritos'}
			}
			if(user.status == 'subscribed'){
				user.status = 'unsubscribed';
				user.last_message = 'no_suscription_confirmation';
				user.save(function(err,obj){
					if(err){
						reply_text = {text:'No pudimos eliminarte de nuestra lista de suscritos'}
					}else{
						reply_text = {text:'He tachado tu nombre de la lista de suscritos. No te molestaré con más notificaciones.'}
					}
					replyMessage(reply,reply_text);
				});
			}else if(user.status == 'undefined'){
				user.last_message = 'no_suscription_confirmation';
				user.save(function(err,obj){
					if(err){
						reply_text = {text:'No pudimos eliminarte de nuestra lista de suscritos'}
					}else{
						reply_text = {text:'Entendido. No te enviaré notificaciones en esta Copa América. Nunca. Nunca jamás.'}
					}
					replyMessage(reply,reply_text);
				});
			}else{
				user.last_message = 'no_suscription_confirmation';
				user.save(function(err,obj){
					if(err){
						reply_text = {text:'No pudimos eliminarte de nuestra lista de suscritos'}
					}else{
						reply_text = {text:'Ya habías eliminado tu suscripción a nuestras notificaciones.'}
					}
					replyMessage(reply,reply_text);
				});
			}
		});		
}
});

function getUser(user_id, cb){
	User.findOne({user_id:user_id},function(err,user){ //Looks for the user in the DB
		if(err){
			cb(err);
		}
		cb(null,user)
	});
}

function addUser(user, cb){
	var elem = new User(user);

	elem.save(function(err,obj){
		if(err){ return console.log(err);}
		cb(null,obj);
	});
}

function addUser2(payload, reply){
	bot.getProfile(payload.sender.id, function(err,profile){
		if (err){
			return console.log(err);
		} 

		var elem = new User({
			name:profile.first_name,
			lastname:profile.last_name,
			user_id:payload.sender.id,
			status:'undefined', //when a user is added it's not unsubscribed nor subscribed
			last_message:'prompt'
		});

		elem.save(function(err,obj){
			if(err) return console.log(err);
		});

		var text = {text:'¡Perfecto! Te enviaré notificaciones de goles y resultados finales de partidos.'}
		reply(text, function(err){
			if (err) return console.log(err);
		});
	});
}

function replyMessage(reply, replyText){
	reply(replyText, function(err){
		if (err) return console.log(err);
	});
}

function sendGoalToUser(in_payload, user_id){
	var info = in_payload.scorer+"\nMinuto "+in_payload.minute + "\n"+
	in_payload.team_1.country + " ("+in_payload.team_1.score +") - " + in_payload.team_2.country + " (" + in_payload.team_2.score + ")";
	var send_payload = {
		'attachment':{
			type: 'template',
			payload: {
				template_type:'generic',
				elements:[
				{
					title:'¡Gol de ' + in_payload.country +"!",
					subtitle:info,
					image_url:'http://i.imgur.com/Qj3trVa.jpg'
				}
				]
			}
		}
	}
	console.log(send_payload);
	bot.sendMessage(user_id, send_payload, function(err,info){
		if (err){
			return console.log(err);
		}else{
			console.log(info);
		}
	});
}

function sendMatchResults(in_payload, user_id){
	var result = in_payload.team_1.country + " ("+in_payload.team_1.score +") - " + in_payload.team_2.country + " (" + in_payload.team_2.score + ")";
	var send_payload = {
		'attachment':{
			type: 'template',
			payload: {
				template_type:'generic',
				elements:[
				{
					title:result,
					subtitle:in_payload.comment,
					image_url:'http://i.imgur.com/UwNgclF.jpg'
				}
				]
			}
		}
	}
	console.log(send_payload);
	bot.sendMessage(user_id, send_payload, function(err,info){
		if (err){
			return console.log(err);
		}else{
			console.log(info);
		}
	});
}

function sendMatchStart(in_payload, user_id){
	var result = in_payload.team_1.country + " - " + in_payload.team_2.country + "";
	var send_payload = {
		'attachment':{
			type: 'template',
			payload: {
				template_type:'generic',
				elements:[
				{
					title:result,
					subtitle:in_payload.comment,
					image_url:'http://i.imgur.com/2bsRzkf.jpg'
				}
				]
			}
		}
	}
	console.log(send_payload);
	bot.sendMessage(user_id, send_payload, function(err,info){
		if (err){
			return console.log(err);
		}else{
			console.log(info);
		}
	});
}

function sendTextToUser(text, user_id){
	bot.sendMessage(user_id, {text:text}, function(err,info){
		if (err){
			return console.log(err);
		}else{
			//console.log(info);
		}
	});
}

// Returns true is message contains some affirmation text. False if not recognizable
function identifyPositive(message){
	var validation = ((message.match(/si/i)) ? true : false);
	validation = validation || ((message.match(/sí/i)) ? true : false);
	validation = validation || ((message.match(/clar/i)) ? true : false);
	validation = validation || ((message.match(/afirm/i)) ? true : false);
	validation = validation || ((message.match(/perf/i)) ? true : false);
	validation = validation || ((message.match(/vale/i)) ? true : false);
	return validation;
}

// Returns true is message contains some negation text. False if not recognizable
function identifyNegative(message){
	var validation = ((message.match(/no/i)) ? true : false);
	validation = validation || ((message.match(/ni/i)) ? true : false);
	validation = validation || ((message.match(/nunc/i)) ? true : false);
	validation = validation || ((message.match(/negati/i)) ? true : false);
	return validation;
}

// Returns true is message contains some negation text. False if not recognizable
function identifyGratefulness(message){
	var validation = ((message.match(/grac/i)) ? true : false);
	validation = validation || ((message.match(/super/i)) ? true : false);
	validation = validation || ((message.match(/súper/i)) ? true : false);
	validation = validation || ((message.match(/chév/i)) ? true : false);
	validation = validation || ((message.match(/chev/i)) ? true : false);
	validation = validation || ((message.match(/increi/i)) ? true : false);
	validation = validation || ((message.match(/geni/i)) ? true : false);
	validation = validation || ((message.match(/fant/i)) ? true : false);
	validation = validation || ((message.match(/vale/i)) ? true : false);
	validation = validation || ((message.match(/fenome/i)) ? true : false);
	validation = validation || ((message.match(/fantás/i)) ? true : false);
	validation = validation || ((message.match(/excele/i)) ? true : false);
	return validation;
}

var routes = function(app){
	
	/*app.get('/', (req, res) => {
		return bot._verify(req, res)
	})*/

	app.post('/', (req, res) => {
		bot._handleMessage(req.body)
		res.end(JSON.stringify({status: 'ok'}))
	});

	app.post('/bot/send_message', (req, res) => {
		User.count({}, function( err, count){
			User.find(function(err,elems){
				elems.forEach(function(elem,idx){
					if(elem.status == 'subscribed'){
						if (req.body.type == 'text'){
							sendTextToUser(req.body.text,elem.user_id);
						}else if(req.body.type == 'goal'){
							sendGoalToUser(req.body,elem.user_id);
						}else if(req.body.type == 'match'){
							sendMatchResults(req.body,elem.user_id);
						}else if(req.body.type == 'start'){
							sendMatchStart(req.body,elem.user_id);
						}
					}
				});
			});
		});
		return res.send("Messages sucessfully sent");
	});
}


module.exports = routes;







