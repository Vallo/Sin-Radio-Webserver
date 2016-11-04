'use strict';
var tts = require('../../common/utils/tts.js');
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/try', function(){
  	tts.getTts('Bienvenido a sin radio', 'bienvenido');
  })
  server.use(router);
};
