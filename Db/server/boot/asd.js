module.exports = function(app) {
  app.dataSources.mysql.automigrate('chofer,cliente,usuario,movil,denuncia, viaje', function(err) {
    if (err) console.log(err);
  });  
};