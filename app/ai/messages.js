'use strict'

var response = {}

var resultadosTotal = "USA (0) - COL (2) \n CRO (0) - PAR (0) \n BRA (0) - ECU (0) \n HAI (0) - PER (1) \n JAM (0) - VEN (1) \n MEX (3) - URU (1)"
var calendarioTotal = "PAN - BOL (6-6-16 18:00h) \n ARG - CHI (6-6-16 21:00h) \n USA - CRO (7-6-16 19:00h) \n COL - PAR (7-6-16 21:30h)"

//{rude:true or false if the message have bad words, intent:['scores'], countries:['Colombia','Argentina','Bolivia'], mocking:true}
response.getMessageToSend = function(engineOutput){
	var message = ":)"
	var reply = null
	var button = false
	// USERS USES BAD WORDS
	if(engineOutput.rude){
		message = "Uy, si usas malas palabras te dejo de hablar";
	// USER WANTS TO KNOW MORE THAN ONE THING
	}else if(engineOutput.intent.length > 1){
		message = "Veo que me quieres preguntar por muchas cosas, por favor intenta de una a la vez"
	// USER WANTS TO KNOW ABOUT RESULTS
	}else if((engineOutput.intent.length == 1)&&(engineOutput.intent[0] == "scores")){
		message = "Puedo darte todos los resultados hasta el momento mientras aprendo a entenderte mejor."
		reply = resultadosTotal
		button = true //EN BOTOÓN: Para conocer el fixture completo entra acá (http://bit.ly/CappInfo)
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
	var fullmessage = {
		message:message,
		reply:reply
	}
	return fullmessage;
}
module.exports = response