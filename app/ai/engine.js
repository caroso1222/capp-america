'use strict'

var engine = {};

engine.processMessage = function(message){
	let response = {}
	response.intent = identifyIntent(message)
	response.country = identifyCountry(message)
	return response
}

function identifyCountry(message){
	var country = "none";
	country = message.match(/lombia/i) ? "Colombia":"none"
	country = message.match(/ruguay/i) ? "Uruguay":"none"
	country = message.match(/stados/i) ? "Estados Unidos":"none"
	country = message.match(/usa/i) ? "Estados Unidos":"none"
	country = message.match(/raguay/i) ? "Paraguay":"none"
	country = message.match(/aití/i) ? "Haití":"none"
	country = message.match(/aiti/i) ? "Haití":"none"
	country = message.match(/eru/i) ? "Perú":"none"
	country = message.match(/erú/i) ? "Perú":"none"
	country = message.match(/asil/i) ? "Brasil":"none"
	country = message.match(/uador/i) ? "Ecuador":"none"
	country = message.match(/maica/i) ? "Jamaica":"none"
	country = message.match(/nezuela/i) ? "Venezuela":"none"
	country = message.match(/xico/i) ? "México":"none"
	country = message.match(/namá/i) ? "Panamá":"none"
	country = message.match(/nama/i) ? "Panamá":"none"
	country = message.match(/livia/i) ? "Bolivia":"none"
	country = message.match(/gentina/i) ? "Argentina":"none"
	country = message.match(/ile/i) ? "Chile":"none"
	return country
}

function identifyIntent(message){
	var intent = "none"
	if isScoresPrompt(message){
		intent = "scores"
	}else if isCalendarPrompt(message){
		intent = "calendar"
	}
	return intent;
}

//Returns 'true' if the user is asking for scores. Ej, cuanto quedo el partido, como le fue a colombia, etc. Returns 'false' otherwise
function isScoresPrompt(message){
	var validation = ((message.match(/uanto quedo/i)) ? true : false);
	validation = validation || ((message.match(/uánto quedó/i)) ? true : false);
	validation = validation || ((message.match(/uanto quedó/i)) ? true : false);
	validation = validation || ((message.match(/uánto quedo/i)) ? true : false);
	validation = ((message.match(/omo quedo/i)) ? true : false);
	validation = validation || ((message.match(/ómo quedó/i)) ? true : false);
	validation = validation || ((message.match(/omo quedó/i)) ? true : false);
	validation = validation || ((message.match(/ómo quedo/i)) ? true : false);
	validation = validation || ((message.match(/uién ganó/i)) ? true : false);
	validation = validation || ((message.match(/uién gano/i)) ? true : false);
	validation = validation || ((message.match(/uien ganó/i)) ? true : false);
	validation = validation || ((message.match(/uien gano/i)) ? true : false);
	return validation;
}

//Returns 'true' if the user is asking for match calendar. Ej, cuando juega, cuando vuelve a jugar, etc. Returns 'false' otherwise
function isCalendarPrompt(message){
	var validation = ((message.match(/si/i)) ? true : false)
	validation = validation || ((message.match(/sí/i)) ? true : false)
	validation = validation || ((message.match(/clar/i)) ? true : false)
	validation = validation || ((message.match(/afirm/i)) ? true : false)
	validation = validation || ((message.match(/perf/i)) ? true : false)
	validation = validation || ((message.match(/vale/i)) ? true : false)
	return validation
}

module.exports = engine