
var db = require('../../common/utils/db.js');

module.exports = function(app){
	db.query('CREATE TABLE IF NOT EXISTS CHOFER (android_id varchar(50), tel int primary key, nombre varchar(50), claveSMS int)').
	then(db.query('CREATE TABLE IF NOT EXISTS VIAJES (ID INT PRIMARY KEY, CHOFER VARCHAR(50), LATLON POINT, DIR VARCHAR(200), monto decimal(6,2), fecha TIMESTAMP )'));
}