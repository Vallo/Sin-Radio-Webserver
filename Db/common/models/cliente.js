'use strict';
var tts = require('../utils/tts.js');

module.exports = function(Cliente) {
	Cliente.observe('after save', function logQuery(ctx, next) {
		var text = ctx.instance.direccionFavorita + ' ' + ctx.instance.detalle;
		console.log(text);
		tts.getTts(text, ctx.instance.telefono);
		next();
	});
};
