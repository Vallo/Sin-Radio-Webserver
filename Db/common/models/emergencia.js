'use strict';

var loopback = require('loopback');
module.exports = function(Emergencia) {
	app = loopback();
	Emergencia.observe('after save', function logQuery(ctx, next) {
		app.io.emit('emergencia',ctx.instance);
		next();
	}
};
