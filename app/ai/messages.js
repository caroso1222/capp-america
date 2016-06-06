var response = {}
​
var resultadosTotal = "USA (0) - Colombia (2) :: Costa Rica (0) - Paraguay (0) :: Brasil (0) - Ecuador (0) :: Haití (0) - Perú (1) :: Jamaica (0) - Venezuela (1) :: México (3) - Uruguay (1)"
var calendarioTotal = "Panamá - Bolivia (6-6-16 18:00h Bogotá Time) :: Argentina - Chile (6-6-16 21:00h Bogotá Time) :: USA - Costa Rica (7-6-16 19:00h Bogotá Time) :: Colombia - Paraguay (7-6-16 21:30h Bogotá Time) :: Brail - Haití (8-6-16 18:30h Bogotá Time) :: Ecuador - Perú (8-6-16 21:30h Bogotá Time) :: Uruguay - Venezuela (9-6-16 18:30h Bogotá Time) :: México - Jamaica (9-6-16 21:30h Bogotá Time) :: Chile - Bolivia (10-6-16 18:00h Bogotá Time) :: Argentina - Panamá (10-6-16 20:30h Bogotá Time)"

//{rude:true or false if the message have bad words, intents:['scores'], countries:['Colombia','Argentina','Bolivia'], mocking:true}
response.getMessageToSend = function(engineOutput){
	var message = ":)"
	var reply = null
	var button = false
	// USERS USES BAD WORDS
	if(engineOutput.rude){
		message = "Uy, si usas malas palabras te dejo de hablar";
	// USER WANTS TO KNOW MORE THAN ONE THING
	}else if(engineOutput.intents.length > 1){
		message = "Veo que me quieres preguntar por muchas cosas, por favor intenta de una a la vez"
	// USER WANTS TO KNOW ABOUT RESULTS
	}else if((engineOutput.intents.length == 1)&&(engineOutput.intents.find == "scores")){
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
	}else if((engineOutput.intents.length == 1)&&(engineOutput.intents.find == "calendar")){
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
	}else if((engineOutput.intents.length == 1)&&(engineOutput.intents.find == "news")){
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
	var fullmessage = {message, reply}
	return fullmessage;
}
module.exports = response