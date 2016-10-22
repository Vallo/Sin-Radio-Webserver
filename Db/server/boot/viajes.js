'use strict';
var requestify = require('requestify');
var url = 'http://api.sin-radio.com.ar/'
module.exports = function(app) {

	var router = app.loopback.Router();


/*
	router.get('/Api/viajes', function(req,res){
		requestify.get(url + 'viajes').then(function(response){
			res.send(response.getBody());
		});
	});

	router.get('/Api/viajesPendientes', function(req,res){
		requestify.get(url + 'viajes').then(function(response){
			res.send(response.getBody());
		});
	});
	router.post('/Api/viajes', function(req,res){
		var _lat = req.body.lat;
		var _lon = req.body.lon;
		var _dir = req.body.dir;
		if (!_lat || !_lon || !_dir) {
			console.log(_lat + _lon + _dir);
			res.status(400);
			res.send('Error');
			console.log('error');
			return;
		}
		else
		{
			requestify.post(url + 'viajes', {
				lat: _lat,
				lon: _lon,
				dir: _dir
			}).then(function(response){
				res.send(response.getBody());
			}).catch(function(err){ //si no tengo internet????????????? lo mando como viaje pendiente

			});
		}
	});*/
	app.use(router);
};