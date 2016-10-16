'use strict';
var tts = require('./utils/tts.js');

module.exports = function(Cliente) {
	Cliente.observe('after save', function logQuery(ctx, next) {
		tts.getTts(Cliente.direccion, Cliente.telefono);
		next();
	});
};
