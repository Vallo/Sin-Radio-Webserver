module.exports = function(app) {
  /*
  app.dataSources.mysql.automigrate('chofer', function(err) {
    if (err) console.log(err);
  });
  app.dataSources.mysql.automigrate('cliente', function(err) {
    if (err) console.log(err);
  });  
  app.dataSources.mysql.automigrate('usuario', function(err) {
    if (err) console.log(err);
  });  
  app.dataSources.mysql.automigrate('movil', function(err) {
    if (err) console.log(err);
  });  
  app.dataSources.mysql.automigrate('denuncia', function(err) {
    if (err) console.log(err);
  });*/  
  app.dataSources.mysql.automigrate('posicion', function(err) {
    if (err) console.log(err);
  });
};
