'use strict';
var url = require('../../config.js').cloud;

var requestify = require('requestify');
module.exports = function(Viaje) {
	
	Viaje.observe('after save', function logQuery(ctx, next) {
		requestify.post(url + '/viaje',{
			lat:ctx.instance.direccionOrigenLatLon.lat,
			lon:ctx.instance.direccionOrigenLatLon.lng,
			dir:ctx.instance.direccionOrigen,
			detalle:ctx.instance.detalle,
			idLocal:ctx.instance.id
		}).fail(function(err){
			console.log(err);
			ctx.instance.updateAttributes({monto:0});
		});		
		next();
	});
};
