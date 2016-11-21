'use strict';

var app = require('../../server/server');

module.exports = function(Emergencia) {
	Emergencia.observe('after save', function logQuery(ctx, next) {
		app.io.emit('emergencia',ctx.instance);
		next();
	});
};
