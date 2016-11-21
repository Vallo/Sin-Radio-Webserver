'use strict';

module.exports = function(Alertavial) {
	Alertavial.observe('after save', function logQuery(ctx, next) {
		requestify.post(url + 'alertaVial',{
			desc:ctx.instance.detalle
		});
		next();
	});
};
