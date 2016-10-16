'use strict';
var tts = require('../utils/tts.js');

module.exports = function(Cliente) {
	Cliente.observe('after save', function logQuery(ctx, next) {
		console.log(ctx.instance.direccionFavorita);
		tts.getTts(ctx.instance.direccionFavorita, ctx.instance.telefono);
		next();
	});
};
