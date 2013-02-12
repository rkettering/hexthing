var misc = {

truncate: function( fVal ){
	if(fVal < 0) return Math.ceil(fVal);
	else return Math.floor(fVal);
},

sign: function( val ){
	return val > 0 ? 1 : val == 0 ? 0 : -1;
},


dice: function(diceNum){
	return misc.truncate(Math.random() * diceNum) + 1;
},

};