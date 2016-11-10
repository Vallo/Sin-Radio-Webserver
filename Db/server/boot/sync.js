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

	function update(){
		updateViajesLocal();
		getNewViajesOnline();
		updateViajesOnline();
		updatePosiciones();
		getNewEmergencias();
	}



	function updatePosiciones() {
		requestify.get(config.cloud + 'posicion').then(function(response){
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
			if (viajes.length == 0) return;
			requestify.get(config.cloud + 'sync/estadoViajes', {headers:{"viajes":JSON.stringify(viajes)}}).then(function(res){
				var viajesResp = JSON.parse(res.body);
				Promise.all(viajesResp.map(function(viaje){
					return db.query("update viaje set monto = ?, estado = ? where id = ?", [viaje.monto, viaje.estado, viaje.idLocal])
					.catch(function(err){console.log(err);});
				}))
			});
		});
	}

	function updateViajesOnline() {
		db.query("select idCloud from viaje where monto is null").then(function(result){
			var viajes = [];
			for (var i = 0; i < result.length; i++){
				viajes.push(result[i].idCloud);
			}
			if (viajes.length == 0) return;
			requestify.get(config.cloud + 'sync/estadoViajesOnline', {headers:{"viajes":JSON.stringify(viajes)}}).then(function(res){
				var viajesResp = JSON.parse(res.body);
				Promise.all(viajesResp.map(function(viaje){
					return db.query("update viaje set monto = ?, estado = ?, movilAsignado = ? where idCloud = ?", [viaje.monto, viaje.estado, viaje.chofer, viaje.id])
					.catch(function(err){console.log(err);});
				}))
			});
		});
	}


	function getNewViajesOnline() {
		db.query("select max(idCloud) as id from viaje").then(function(result){
			var id = result[0].id
			if(!id) id = 0;
			requestify.get(config.cloud + 'sync/newViajesOnline', {headers:{"id":id}}).then(function(response){
				viajes = JSON.parse(response.body);
				for (var i = 0; i < viajes.length; i++){
					var fecha = moment(viajes[i].fecha);
					db.query('insert into viaje (idCloud, movilAsignado, monto, estado, direccionOrigen, detalle, cliente, fecha, direccionOrigenLatLon) VALUES (?,?,?,?,?,?,?,?,Point(?,?))',
						[viajes[i].id, viajes[i].chofer, viajes[i].monto, viajes[i].estado, viajes[i].dir, viajes[i].detalle, viajes[i].cliente, fecha.format("YYYY/MM/DD HH:mm:ss"),viajes[i].lat,viajes[i].lon]);
				};
			});
		});
	}


	function getNewEmergencias() {
		db.query("select max(id) as id from emergencia").then(function(result){
			var id = result[0].id
			if(!id) id = 0;
			requestify.get(config.cloud + 'sync/newEmergencias', {headers:{"id":id}}).then(function(response){
				emergencias = JSON.parse(response.body);
				for (var i = 0; i < emergencias.length; i++){
					app.models.emergencia.create(emergencias[i]);
			};
		});
		});
	}

};