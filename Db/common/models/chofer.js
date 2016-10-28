'use strict';
var requestify = require('requestify');
var url = require('../../config.js').cloud;

module.exports = function(Chofer) {

	Chofer.observe('after save', function logQuery(ctx, next) {
		requestify.post(url + 'chofer',{
			tel:ctx.instance.telefono,
			nombre:ctx.instance.nombre
		});
		next();
	});
};
