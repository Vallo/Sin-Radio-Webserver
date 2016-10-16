module.exports = function(app) {
  app.dataSources.mysql.automigrate('cliente', function(err) {
    if (err) console.log(err);
  });  
};