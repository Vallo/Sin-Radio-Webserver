var server = require('./server');
var loopback = require('loopback');
var app = module.exports = loopback();
var ds = server.dataSources.db;
server.app.models.cliente.attachTo(app.dataSources.mysql);
var lbTables = ['cliente'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
