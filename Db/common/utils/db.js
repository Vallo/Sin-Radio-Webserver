var Promise = require("bluebird");
var getSqlConnection = require('./dbConnection');


exports.query = function(consulta, param){
	return Promise.using(getSqlConnection(), function(connection){
		return connection.query(consulta, param).then(function(rows){
			return rows;
		}).catch(function(error){
			console.log(error);
			throw error;
		});
	});
};