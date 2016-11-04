var client = require('ari-client'),
Promise = require('bluebird'),
util = require('util');
var db = require('../../common/utils/db.js');

function init(app) {
	client.connect('http://localhost:8088', 'asterisk', 'asterisk')
	.then(function (ari) {
		ari.on('StasisStart', channelJoined);
		function channelJoined (event, incoming) {
			console.log(incoming.caller.name); //SI TENGO ESTE NAME EN LA DB REPRODUZCO SU ARCHIVO ASOCIADO Y ESPERO SU DTMF. SI NO TRANSFIERO A CENTRAL
			incoming.on('ChannelDtmfReceived', dtmfReceived);
			incoming.answer()
			.then(function () {
				return play(incoming, 'bienvenido');
			})
			.catch(function (err) {});
		}

		function dtmfReceived (event, channel) {
			var digit = event.digit;
			switch (digit) {
				case '#':
				play(channel, 'sound:vm-goodbye')
				.then(function () {
					return channel.hangup();
				})
				.finally(function () {
					process.exit(0);
				});
				break;
				case '*':
				play(channel, 'sound:tt-monkeys');
				break;
				default:
				play(channel, util.format('sound:digits/%s', digit));
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
					console.log(err);
					reject(err);
				});
			});
		}
		ari.start('ivr');
	}).catch(function(err){
		console.log('fallo')
		console.log(err);
		init(app);
	})
	.done();
}

module.exports = init();