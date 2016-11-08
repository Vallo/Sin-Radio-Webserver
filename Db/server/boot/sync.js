var requestify = require('requestify');
var cron = require('cron').CronJob;
var db = require('../../common/utils/db.js');
var config = require('../../config.js')
var moment = require('moment');
Promise = require('bluebird'),

module.exports = function(app) {
	update();
	new cron('10,20,30,40,50,60 * * * * *', function() {
		update();
	}, null, true, 'America/Los_Angeles');
};

function update(){
	updateViajesLocal();
	updatePosiciones();
	//updateEmergencias();
}



function updatePosiciones() {
	requestify.get(config.cloud + '/posicion').then(function(response){
		posiciones = JSON.parse(response.getBody());
		for (var i = 0; i < posiciones.length; i++){
			var fecha = moment(posiciones[i].fecha);
			db.query("insert into posicion (android_id,lat,lon, nombre, estado, fecha) VALUES (?,?,?,?,?,?) on duplicate key update lat = values(lat), lon = values(lon), nombre = values(nombre), estado = values(estado), fecha = values(fecha)", [posiciones[i].android_id, posiciones[i].lat,posiciones[i].lon,posiciones[i].nombre,posiciones[i].estado,fecha.format("YYYY/MM/DD HH:mm:ss")])
		};
	});
}

function updateViajesLocal() {
	db.query("select id from viaje where monto is null and idCloud is null").then(function(result){
		var viajes = [];
		for (var i = 0;i < result.length; i++){
			viajes.push(result[i].id);
		}
		requestify.get(config.cloud + '/sync/viajes', {headers:{"viajes":JSON.stringify(viajes)}}).then(function(res){
			var viajesResp = JSON.parse(res.body);
			Promise.all(viajesResp.map(function(viaje){
				return db.query("update viaje set monto = ?, estado = ? where id = ?", [viaje.monto, viaje.estado, viaje.idLocal]).catch(function(err){console.log(err);});
			}))
		});
	});
}

function updateEmergencias() {
	requestify.get(config.cloud + '/sync/emergencias', {headers:{"id":1}}).then(function(response){
		posiciones = JSON.parse(response.getBody());
		for (var i = 0; i < posiciones.length; i++){
			db.query('insert into posicion (android_id,lat,lon, nombre, estado, fecha) VALUES (?,?,?,?,?,?) on duplicate key update lat = values(lat), lon = values(lon), nombre = values(nombre), estado = values(estado), fecha = values(fecha)', [posiciones[i].android_id, posiciones[i].lat,posiciones[i].lon,posiciones[i].nombre,posiciones[i].estado,posiciones[i].fecha.format("YYYY/MM/DD HH:mm:ss")]);
		};
	});
}
