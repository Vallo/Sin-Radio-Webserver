var server = require('./server');
var ds = server.dataSources.db;
server.app.models.cliente.attachTo(app.dataSources.mysql);
var lbTables = ['Cliente'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
