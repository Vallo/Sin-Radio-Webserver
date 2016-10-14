'use strict';
var requestify = require('requestify');
var url = 'http://api.sin-radio.com.ar/'

module.exports = function(Chofer) {

	Chofer.observe('after save', function logQuery(ctx, next) {
		requestify.post(url + 'chofer',{
			tel:ctx.instance.telefono,
			nombre:ctx.instance.nombre
		});
		next();
	});
};
