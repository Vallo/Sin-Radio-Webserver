'use strict';
var tts = require('../utils/tts.js');

module.exports = function(Cliente) {
	Cliente.observe('after save', function logQuery(ctx, next) {
		console.log(Cliente.direccionFavorita);
		tts.getTts(Cliente.direccionFavorita, Cliente.telefono);
		next();
	});
};
