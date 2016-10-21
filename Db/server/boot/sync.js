var requestify = require('requestify');
var cron = require('cron').CronJob;
var db = require('../../common/utils/db.js');


module.exports = function(app) {
	updateChoferes();
	new cron('60 * * * * *', function() {
		updateChoferes();
	}, null, true, 'America/Los_Angeles');
};

/*
function updateViajes() {
	db.query('SELECT MAX(ID) as id FROM VIAJES').then(function(res){
  		requestify.get('http://api.sin-radio.com.ar/viajes/' + res.id).then(function(response){
  			response.body.forEach(function(viaje){
				db.query('INSERT INTO VIAJES (')  				
  			});
		});
	});
}*/

function updateChoferes() {
	/*db.query('SELECT 1 as ANDROID_ID FROM chofer').then(function(res){
  		requestify.get('http://api.sin-radio.com.ar/chofer/').then(function(response){
  			var choferes = JSON.parse(response.body);
  			for (var i = 0; i < choferes.length; i++){
  				//console.log(choferes[i]);
  				db.query('INSERT INTO CHOFER (ANDROID_ID, TEL,NOMBRE) VALUES (?,?,?)', [choferes[i].android_id, choferes[i].tel,choferes[i].nombre]);
  			};
  			console.log('OUT');
		});
	});*/
}