var mysql = require('promise-mysql');

pool = mysql.createPool({
  host     : 'localhost',
	  user     : 'sinradio',
	  password : 'Sin-Radio-5507',
	  database : 'API',
	  port: '5507',
  connectionLimit: 10
});

function getSqlConnection() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}

module.exports = getSqlConnection;
