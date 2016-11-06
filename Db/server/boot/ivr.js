'use strict';
var requestify = require('requestify');
var url = 'http://api.sin-radio.com.ar/';
var db = require('../../common/utils/db.js');
var tts = require('../../common/utils/tts.js');
module.exports = function(app) {

	var router = app.loopback.Router();
	router.get('/initTts', function(req,res){
		tts.getTts("Bienvenido a sin radio",'bienvenido');
		tts.getTts("Pulse uno si desea pedir un taxi hacia ",'desea');
		tts.getTts("O aguarde y será atendido ",'aguarde');
		tts.getTts("Su taxi se encuentra en camino. Muchas gracias por utilizar sin radio.",'taxiPedido');
		res.sendStatus(200);
	});
	app.use(router);
};