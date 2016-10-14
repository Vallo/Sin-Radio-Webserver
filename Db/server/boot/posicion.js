'use strict';
var requestify = require('requestify');

module.exports = function(app) {
	var router = app.loopback.Router();
	router.get('/Api/posicion', function(req,res){
		requestify.get('http://api.sin-radio.com.ar/posicion').then(function(response){
			res.send(response.getBody());
		});
	});
	app.use(router);
};