var requestify = require('requestify')
var url = require('../../config.js').cloud;
module.exports = function(app) {
  if (process.argv[2] == 'init')
  {
    Init();
  }
  if (process.argv[2] == 'fullInit')
  requestify.get(url + 'Init').then(function(res){
    console.log(res.body);
    Init();
  });

  function Init(){
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
    }); 
    app.dataSources.mysql.automigrate('emergencia', function(err) {
      if (err) console.log(err);
    }); 
    app.dataSources.mysql.automigrate('posicion', function(err) {
      if (err) console.log(err);
    });
    app.dataSources.mysql.automigrate('alertaVial', function(err) {
      if (err) console.log(err)
    });
    app.dataSources.mysql.automigrate('viaje', function(err) {
      if (err) console.log(err)
    });
    console.log('base inicializada')
  }
};

