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
	if(message.match(/lombia/i)){
		country = "Colombia"
	}else if(message.match(/ruguay/i)){
		country = "Uruguay"
	}else if(message.match(/stados/i)){
		country = "Estados Unidos"
	}else if(message.match(/usa/i)){
		country = "Estados Unidos"
	}else if(message.match(/raguay/i)){
		country = "Paraguay"
	}else if(message.match(/aití/i)){
		country = "Haití"
	}else if(message.match(/aiti/i)){
		country = "Haití"
	}else if(message.match(/eru/i)){
		country = "Perú"
	}else if(message.match(/erú/i)){
		country = "Perú"
	}else if(message.match(/asil/i)){
		country = "Brasil"
	}else if(message.match(/uador/i)){
		country = "Ecuador"
	}else if(message.match(/maica/i)){
		country = "Jamaica"
	}else if(message.match(/nezuela/i)){
		country = "Venezuela"
	}else if(message.match(/xico/i)){
		country = "México"
	}else if(message.match(/namá/i)){
		country = "Panamá"
	}else if(message.match(/nama/i)){
		country = "Panamá"
	}else if(message.match(/livia/i)){
		country = "Bolivia"
	}else if(message.match(/gentina/i)){
		country = "Argentina"
	}else if(message.match(/ile/i)){
		country = "Chile"
	}

	return country
}

function identifyIntent(message){
	var intent = "none"
	if (isScoresPrompt(message)){
		intent = "scores"
	}else if (isCalendarPrompt(message)){
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
	validation = validation || ((message.match(/omo quedo/i)) ? true : false);
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