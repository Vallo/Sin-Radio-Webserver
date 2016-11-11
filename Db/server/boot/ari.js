var client = require('ari-client'),
Promise = require('bluebird'),
util = require('util');

module.exports = function(app) {
	console.log('ok');
	client.connect('http://localhost:8088', 'asterisk', 'asterisk')
	.then(function (ari) {
		ari.on('StasisStart', channelJoined);

		function channelJoined (event, incoming) {
			var clientes = app.models.cliente;//SI TENGO ESTE NAME EN LA DB REPRODUZCO SU ARCHIVO ASOCIADO Y ESPERO SU DTMF. SI NO TRANSFIERO A CENTRAL
			incoming.once('ChannelDtmfReceived', dtmfReceived);
			incoming.answer()
			.then(function () {
				return play(incoming, 'bienvenido'); //Bienvenido a sin-radio
			})
			.catch(function (err) {})
			.then(function(){
				clientes.find({where: {telefono : incoming.caller.name}}, function(err,result){
					if (err) return;
					console.log(result);
					if(result.length > 0){ //si encuentro cliente
						play(incoming, 'desea').then(function(){ //pulse uno si desea pedir un taxi para la dirección
							return play(incoming, result[0].telefono); //direccion
						}).
						then(function(){ 
							return play(incoming, 'aguarde'); //o aguarde y será atendido 
						});
					}
					else {
						console.log('TRANSFIERO');
						incoming.hangup();
						//incoming.derivaraInterno(); //si no encuentro el cliente lo mando con el interno.
					}
				});
			}).then(function(){

			});
		}
		function dtmfReceived (event, channel) {
			var digit = event.digit;
			switch (digit) {
				case '1': //pido taxi
				var clientes = app.models.cliente;
				clientes.find({where: {telefono : channel.caller.name}}, function(err,result){
					if (err) return;
					if(result){
						console.log('pedi taxi a ' + result[0].direccionFavorita + ' --------- ' + JSON.stringify(result[0].direccionFavoritaLatLon));
						//app.models.viaje.create({direccionOrigen : result.direccionFavorita, direccionOrigenLatLon : result.direccionFavoritaLatLon})
						play(channel, 'taxiPedido').then(function(){
							channel.hangup();
						});
					}
				});
				break;
				case '2': //pido interno creo bridge y transfiero?
				
				break;
				default:
				 //error? no hago nada
				}
			}

			function play (channel, sound) {
				var playback = ari.Playback();

				return new Promise(function (resolve, reject) {
					playback.on('PlaybackFinished', function (event, playback) {
						resolve(playback);
					});
					channel.play({media:'sound:'+sound}, playback)
					.catch(function (err) {
						console.log('err')
						//console.log(err);
						//reject(err);
					});
				});
			}
			ari.start('ivr2');
		}).catch(function(err){
			console.log('fallo')
			console.log(err);
		})
		.done();
	}
