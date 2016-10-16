var	tts = require('voice-rss-tts');
var fs = require('fs');
var location = '/tmp/';
exports.getTts = function(text, id){
	tts.speech({
		key: '5e242dbd3ed74cbbb842420b7de7b3fd',
		src: text,
		hl: 'es-es',
		ssl: true,
		callback: function (error, content) {
			console.log(error || content);
			fs.writeFile(location + id,content, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("Archivo guardado con éxito");
			});
		}
	});
};