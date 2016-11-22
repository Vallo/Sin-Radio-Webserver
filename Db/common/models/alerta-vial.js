'use strict';
var url = require('../../config.js').cloud;
var requestify = require('requestify');
module.exports = function(Alertavial) {
	Alertavial.observe('after save', function logQuery(ctx, next) {
		requestify.post(url + 'alertaVial',{
			desc:ctx.instance.detalle
		});
		next();
	});
};
