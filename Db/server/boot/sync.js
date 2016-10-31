var requestify = require('requestify');
var cron = require('cron').CronJob;
var db = require('../../common/utils/db.js');
var config = require('../../config.js')


module.exports = function(app) {
	update();
	new cron('10,20,30,40,50,60 * * * * *', function() {
		update();
	}, null, true, 'America/Los_Angeles');
};

function update(){
	updateViajes();
	updateChoferes();
	updatePosiciones();
}



function updatePosiciones() {
	requestify.get(config.cloud + '/posicion').then(function(response){
		posiciones = JSON.parse(response.getBody());
		for (var i = 0; i < posiciones.length; i++){
			console.log(posiciones);
			db.query('insert into posicion (android_id,lat,lon, nombre, estado, fecha) VALUES (?,?,?,?,?,?)', [posiciones[i].android_id, posiciones[i].lat,posiciones[i].lon,posiciones[i].nombre,posiciones[i].estado,posiciones[i].fecha]);
		};
	});
}

function updateViajes() {
	
}

function updateChoferes() {
	
}