module.exports = function(app) {
  app.dataSources.mysql.automigrate('Role', function(err) {
    if (err) console.log(err);
  });
  app.dataSources.mysql.automigrate('AccessToken', function(err) {
    if (err) console.log(err);
  });
  app.dataSources.mysql.automigrate('ACL', function(err) {
    if (err) console.log(err);
  });
  app.dataSources.mysql.automigrate('RoleMapping', function(err) {
    if (err) console.log(err);
  });
  
};