var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
	text: String,
	type: String,
	reach: Number
},{
	timestamps: true
});

var Message = mongoose.model('Message',objectSchema);

//Returns 'true' if we need to send complete results
function messageResultsAll(){
	var text = null
	if ((isScoresPrompt(message)) & (g1(message).length == 0)||(g1(message).length >= 3))
	{
		text = "Todos los resultados de la copa América hasta hoy son [USA (0) - Colombia (2) :: Costa Rica (0) - Paraguay (0) :: Haití (0) - Perú (1) :: Jamaica (0) - Venezuela (1) :: México (3) - Uruguay (1)"
	}
	}else if (g1(message).length == 1)
	{
		g1(message).find
	}

	if (isResultsAll())
	{
	text = "Todos los resultados de la copa América hasta hoy son [USA (0) - Colombia (2) :: Costa Rica (0) - Paraguay (0) :: Haití (0) - Perú (1) :: Jamaica (0) - Venezuela (1) :: México (3) - Uruguay (1)"
	} else
	return text
}
module.exports = Message;