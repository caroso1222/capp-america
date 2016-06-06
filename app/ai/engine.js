'use strict'

var engine = {};

engine.processMessage = function(message){
	let response = {}
	response.intent = identifyIntent(message)
	response.countries = identifyCountries(message)
	response.spacetime = identifySpaceTime(message)
	return response
}

//Returns the list of teams the user is asking for
function gi(message){
	var countries = [];
	if(message.match(/lombia/i)){
		countries.push("Colombia")
	}if(message.match(/ruguay/i)){
		country = "Uruguay"
	}if(message.match(/usa/i) || message.match(/usa/i)){
		countries.push("Estados Unidos")
	}if(message.match(/raguay/i)){
		countries.push("Paraguay")
	}if(message.match(/aití/i) || message.match(/aiti/i)){
		countries.push("Haití")
	}if(message.match(/eru/i)){
		countries.push("Perú")
	}if(message.match(/erú/i)){
		countries.push("Perú")
	}if(message.match(/asil/i)){
		countries.push("Brasil")
	}if(message.match(/uador/i)){
		countries.push("Ecuador")
	}if(message.match(/maica/i)){
		countries.push("Jamaica")
	}if(message.match(/nezuela/i)){
		countries.push("Venezuela")
	}if(message.match(/xico/i)){
		countries.push("México")
	}if(message.match(/namá/i) || message.match(/nama/i)){
		countries.push("Panamá")
	}if(message.match(/livia/i)){
		countries.push("Bolivia")
	}if(message.match(/gentina/i)){
		countries.push("Argentina")
	}if(message.match(/ile/i)){
		countries.push("Chile")
	}
	return countries
}

//Returns the intention of the user. If is asking for scores, calendar, is a greatfull, congratulation or is just mocking the bot.
function identifyIntent(message){
	var intent = []
	if (isScoresPrompt(message)){
		intent.push("scores")
	}if (isCalendarPrompt(message)){
		intent.push("calendar")
	}if (isMockingPrompt(message)){
		intent.push("mocking")
	}if (isAggressiveMockingPrompt(message)){
		intent.push("aggressive")
	}
	return intent;
}

//Returns the space-time the user is asking for information. Past, Present or future represented in numbers.
function identifySpaceTime(message){
	var days = null
	if (message.match(/hoy/i)){
		days = 0
	}else if (message.match(/esta ma[ñn]a[nñ]a/i)){
		days = 0
	}else if (message.match(/esta tarde/i)){
		days = 0
	}else if (message.match(/esta noche/i)){
		days = 0
	}else if (isScoresPrompt(message)); // Asume que si el usuario pregunta por resultados, es pasado
	{
		days = -3
	}else if (message.match(/pasado/i)){
		days = -3
	}else if (message.match(/antier/i)){
		days = -2
	}else if (message.match(/ayer/i)){
		days = -1
	}else if (message.match(/ma[ñn]a[nñ]a/i)){
		days = 1
	}else if (message.match(/pasado ma[ñn]a[nñ]a/i)){
		days = 2
	}
	else if (message.match(/futuro/i)){
		days = 3
	}else if (isCalendarPrompt(message)); // Asume que si el usuario pregunta por calendarios, es futuro
	{
		days = 3
	}
	return intent;
}

//Returns 'true' if the user is asking for scores. Ej, cuanto quedo el partido, como le fue a colombia, etc. Returns 'false' otherwise
function isScoresPrompt(message){
	var validation = ((message.match(/u[aá]nto qued[oó]/i)) ? true : false); //cuánto quedó
	validation = validation || ((message.match(/[oó]mo qued[oó]/i)) ? true : false); //cómo quedó
	validation = validation || ((message.match(/ui[eé]n gan[oó]/i)) ? true : false); //quién ganó
	validation = validation || ((message.match(/sultados/i)) ? true : false); //resultados
	return validation;
}

//Returns 'true' if the user is asking for match calendar. Ej, cuando juega, cuando vuelve a jugar, etc. Returns 'false' otherwise
function isCalendarPrompt(message){
	var validation = ((message.match(/[aá]ndo/i)) ? true : false) //cuándo
	validation = validation || ((message.match(/ui[ée]n juega/i)) ? true : false); //quién juega
	validation = validation || ((message.match(/ui[ée]n jug[óo]/i)) ? true : false); //quién juegó
	validation = validation || ((message.match(/rtidos/i)) ? true : false); //qué ó cuáles partidos
	validation = validation || ((message.match(/juegos/i)) ? true : false); //qué ó cuáles juegos
	validation = validation || ((message.match(/lendario/i)) ? true : false); //calendario
	validation = validation || ((message.match(/xture/i)) ? true : false); //fixture
	return validation
}

//Returns 'true' if the user is mocking the bot. Ej, mandame un beso. Returns 'false' otherwise
function isMockingPrompt(message){
	var validation = ((message.match(/mandame un beso/i)) ? true : false)
	validation = validation || ((message.match(/me das un beso/i)) ? true : false);
	validation = validation || ((message.match(/eres gay/i)) ? true : false);
	validation = validation || ((message.match(/qui[ée]n eres/i)) ? true : false);
	return validation
}

//Returns 'true' if the user is mocking with bad words the bot. Ej, bobo, hijue*$, malpa*$. Returns 'false' otherwise
function isAggressiveMockingPrompt(message){
	var validation = ((message.match(/marica/i)) ? true : false)
	validation = validation || ((message.match(/hijueputa/i)) ? true : false);
	validation = validation || ((message.match(/malparido/i)) ? true : false);
	validation = validation || ((message.match(/maricon/i)) ? true : false);
	validation = validation || ((message.match(/pendejo/i)) ? true : false);
	validation = validation || ((message.match(/gonhorrea/i)) ? true : false);
	validation = validation || ((message.match(/pichurria/i)) ? true : false);
	return validation
}

//Returns 'true' if we need to send complete results
function isResultsAll(message){
	var validation = false
	if (isScoresPrompt(message))
	{
	validation = validation || (g1.count == 0) ? true : false)
	validation = validation || (g1.count >= 3) ? true : false);
	}
	return validation
}

//Returns 'true' if we need to send complete results
function isResultsAll(message){
	var validation = false
	if (isScoresPrompt(message))
	{
	validation = validation || (g1.count == 0) ? true : false)
	validation = validation || (g1.count >= 3) ? true : false);
	}
	return validation
}

module.exports = engine