module.exports = function(app) {
  app.dataSources.mysql.automigrate('chofer', function(err) {
    if (err) console.log(err);
  });  
};