var client = require('ari-client'),
Promise = require('bluebird'),
util = require('util');

module.exports = function(app) {
	client.connect('http://192.168.1.142:8088', 'asterisk', 'asterisk')
	.then(function (ari) {

		ari.once('StasisStart', channelJoined);

		function channelJoined (event, incoming) {
			incoming.on('ChannelDtmfReceived', dtmfReceived);

			incoming.answer()
			.then(function () {
				return play(incoming, 'sound:hello-world');
			})
			.catch(function (err) {});
		}

		function dtmfReceived (event, channel) {
			console.log('entro')
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

				channel.play({media: sound}, playback)
				.catch(function (err) {
					reject(err);
				});
			});
		}

		ari.start('ivr');
	})
	.done();

}