'use strict';
var requestify = require('requestify');
var url = 'http://api.sin-radio.com.ar/';
var db = require('../../common/utils/db.js');
var tts = require('../../common/utils/tts.js');
module.exports = function(app) {

	var router = app.loopback.Router();


	router.get('/Api/ivr/:id', function(req,res){ //me pasan el ANI devuelvo la ruta a los wav a reproducir con sus ID de dirección asociados?
		var ani = req.params.id;
		db.query('SELECT ID, RUTA_WAV FROM DIR_CLIENTE WHERE ANI = ?', ani).then(function(res){ 
			if(!res[0]) res.send(400); // cliente nuevo
			else
				res.send(JSON.stringify(res)); 
		});
	});

	router.get('/tts', function(req,res){
		tts.getTts("asd",1);
		res.sendStatus(200);
	});
	app.use(router);
};