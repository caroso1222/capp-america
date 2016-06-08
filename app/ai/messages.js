'use strict'

var Score = require('../models/score');
const constants = require('../constants')

var response = {}

var resultadosTotal = "USA (0) - COL (2) \n CRO (0) - PAR (0) \n BRA (0) - ECU (0) \n HAI (0) - PER (1) \n JAM (0) - VEN (1) \n MEX (3) - URU (1)"
var calendarioTotal = "PAN - BOL (6-6-16 18:00h) \n ARG - CHI (6-6-16 21:00h) \n USA - CRO (7-6-16 19:00h) \n COL - PAR (7-6-16 21:30h)"

//{rude:true or false if the message have bad words, intent:['scores'], countries:['Colombia','Argentina','Bolivia'], mocking:true}
response.getMessageToSend = function(engineOutput, cb){
	var message = ":)"
var reply = null
var button = false
var type = "text"
var gral_payload = [];



	// USERS USES BAD WORDS
	if(engineOutput.rude){
		message = "Uy, si usas malas palabras te dejo de hablar";
		cb(null,{
			message:message,
			type:"text"
		})
	// USER WANTS TO KNOW MORE THAN ONE THING
}else if(engineOutput.intent.length > 1){
	message = "Veo que me quieres preguntar por muchas cosas, por favor intenta de una a la vez"
	cb(null,{
		message:message,
		type:"text"
	})
	// USER WANTS TO KNOW ABOUT RESULTS
}else if((engineOutput.intent.length == 1)&&(engineOutput.intent[0] == "scores")){
	message = "Puedo darte todos los resultados hasta el momento mientras aprendo a entenderte mejor."

		// USER ASKS FOR JUST ONE COUNTRY
		if (engineOutput.countries.length == 1){
			Score.find({$or:[{team_1:engineOutput.countries[0]},{team_2:engineOutput.countries[0]}]},
				function(err,elems){
					if (err) cb(err)
						var elems_payload = []
					for (let i = 0; i<elems.length;i++){
						let card_title = elems[i].team_1 + " ("+elems[i].team_1_score+") " +" - "+ elems[i].team_2 + " ("+elems[i].team_2_score+") "
						let key = constants.getCountryCode(elems[i].team_1) + "_" + constants.getCountryCode(elems[i].team_2);
						let img = constants.pics.results[key];
						if (!img) {
        					//try looking for the image in different order
        					key = constants.getCountryCode(elems[i].team_2) + "_" + constants.getCountryCode(elems[i].team_1);
        					img = constants.pics.results[key];
        					if (!img) {
        						img = 'http://i.imgur.com/UwNgclF.jpg'
        					}
        				}
        				elems_payload.push({
        					title:card_title,
        					image_url:img
        				})
        			}
        			//The payload contains an array of elems with a title (score) and an image (match)
        			cb(null,{
        				message:message,
        				type:"card",
        				payload:elems_payload
        			})
        		});
}

	// USER WANTS TO KNOW ABOUT CALENDAR
}else if((engineOutput.intent.length == 1)&&(engineOutput.intent[0] == "calendar")){
	message = "Puedo darte todo el fixture de la segunda fecha de la fase de grupos mientras aprendo a entenderte mejor."
	reply = calendarioTotal
		button = true //BUTTON: Para conocer el fixture completo entra acá (http://bit.ly/CappInfo)
		/*
		// USER ASKS FOR JUST ONE COUNTRY
		if (engineOutput.countries.length == 1){
			// IF THE COUNTRY ID IS 0
			if ((engineOutput.countries.find == "Colombia"))
			{
			// IF THE COUNTRY ID IS 1
			}else if ((engineOutput.countries.find == "Estados Unidos"))
			{

			}
		}
		*/
		cb(null,{
			message:message,
			type:"text"
		})
	}
	// USER WANTS TO KNOW ABOUT NEWS
	else if((engineOutput.intent.length == 1)&&(engineOutput.intent[0] == "news")){
		message = "Si estás buscando noticias de la Copa te recomiendo entrar a este portal"
		button = true //BUTTON: Futbolred (http://bit.ly/PappFutbolRed)
		/*
		// USER ASKS FOR JUST ONE COUNTRY
		if (engineOutput.countries.length == 1){
			// IF THE COUNTRY ID IS 0
			if ((engineOutput.countries.find == "Colombia"))
			{
			// IF THE COUNTRY ID IS 1
			}else if ((engineOutput.countries.find == "Estados Unidos"))
			{

			}
		// USER ASKS FOR TWO COUNTRIES
		}else if (engineOutput.countries.length == 2){


		// USER ASKS FOR SEVERAL COUNTRIES OR NONE COUNTRY
		}else if ((engineOutput.countries.length >= 2)||(engineOutput.countries.length == 0)){
			message = "Si estás buscando noticias de la Copa te recomiendo entrar a este portal"
		    button = true //BUTTON: Futbolred (http://bit.ly/PappFutbolRed)
		}
		*/

	}
}

//Creates a generic template message with an image, title, and subtitle
function createCard(title,subtitle,img){
	return {
		'attachment': {
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [{
					title: title,
					subtitle: subtitle,
					image_url: img
				}]
			}
		}
	}
}

module.exports = response








