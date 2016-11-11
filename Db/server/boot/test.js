var client = require('ari-client')
var ari = require('ari-client');
var util = require('util');
 

module.exports = function(app) {
	/*jshint node:true*/
	'use strict';
	 
	 
	ari.connect('http://localhost:8088', 'asterisk', 'asterisk', clientLoaded);
	 
// handler for client being loaded
function clientLoaded (err, client) {
	  if (err) {
		    throw err;
	  }
	 
// handler for StasisStart event

function stasisStart(event, channel) {    // ensure the channel is not a dialed channel
	var dialed = event.args[0] === 'dialed';
	 
	if (!dialed) {
		gestionarCliente(channel);
	}
}
 
function gestionarCliente(channel){
	var clientes = app.models.cliente;
	channel.once('ChannelDtmfReceived', dtmfReceived);
	channel.answer()
	.then(function () {
				return play(channel, 'bienvenido'); //Bienvenido a sin-radio
			})
	.catch(function (err) {})
	.then(function(){
		clientes.find({where: {telefono : channel.caller.name}}, function(err,result){
			if (err) return;
			console.log(result);
					if(result.length > 0){ //si encuentro cliente
						play(channel, 'desea').then(function(){ //pulse uno si desea pedir un taxi para la dirección
							return play(channel, result[0].telefono); //direccion
						}).
						then(function(){ 
							return play(channel, 'aguarde'); //o aguarde y será atendido 
						});
					}
					else {
						console.log('TRANSFIERO');
						originate(channel);
						//incoming.derivaraInterno(); //si no encuentro el cliente lo mando con el interno.
					}
				});
	})



function dtmfReceived (event, channel) {
	var digit = event.digit;
	switch (digit) {
				case '1': //pido taxi
				var clientes = app.models.cliente;
				clientes.find({where: {telefono : channel.caller.name}}, function(err,result){
					if (err) return;
					if(result){
						console.log('pedi taxi a ' + result[0].direccionFavorita + ' --------- ' + JSON.stringify(result[0].direccionFavoritaLatLon));
						//app.models.viaje.create({direccionOrigen : result.direccionFavorita, direccionOrigenLatLon : result.direccionFavoritaLatLon})
						play(channel, 'taxiPedido').then(function(){
							channel.hangup();
						});
					}
				});
				break;
				case '2': //pido interno creo bridge y transfiero?
						console.log('transfiero')
						originate(channel);
				
				break;
				default:
				 //error? no hago nada
				}
			}

			function play (channel, sound) {
				var playback = client.Playback();

				return new Promise(function (resolve, reject) {
					playback.on('PlaybackFinished', function (event, playback) {
						resolve(playback);
					});
					channel.play({media:'sound:'+sound}, playback)
					.catch(function (err) {
						console.log('err')
						//console.log(err);
						//reject(err);
					});
				});
			}
}

			function originate(channel) {
				    var dialed = client.Channel();
				 
				    channel.on('StasisEnd', function(event, channel) {
					      hangupDialed(channel, dialed);
				    });
				 
				    dialed.on('ChannelDestroyed', function(event, dialed) {
					      hangupOriginal(channel, dialed);
				    });
				 
				    dialed.on('StasisStart', function(event, dialed) {
					      joinMixingBridge(channel, dialed);
				    });
				 
				    dialed.originate(
					      {endpoint: 'SIP/vallo-pc', app: 'ivr', appArgs: 'dialed'},
					      function(err, dialed) {
						        if (err) {
							          throw err;
						        }
					    });
			  }
			 
  // handler for original channel hanging up so we can gracefully hangup the
  // other end
  function hangupDialed(channel, dialed) {
	    console.log(
		      'Channel %s left our application, hanging up dialed channel %s',
		      channel.name, dialed.name);
	 
    // hangup the other end
    dialed.hangup(function(err) {
      // ignore error since dialed channel could have hung up, causing the
      // original channel to exit Stasis
    });
  }
 
  // handler for the dialed channel hanging up so we can gracefully hangup the
  // other end
  function hangupOriginal(channel, dialed) {
	    console.log('Dialed channel %s has been hung up, hanging up channel %s',
		      dialed.name, channel.name);
	 
    // hangup the other end
    channel.hangup(function(err) {
      // ignore error since original channel could have hung up, causing the
      // dialed channel to exit Stasis
    });
  }
 
  // handler for dialed channel entering Stasis
  function joinMixingBridge(channel, dialed) {
	    var bridge = client.Bridge();
	 
	    dialed.on('StasisEnd', function(event, dialed) {
		      dialedExit(dialed, bridge);
	    });
	 
	    dialed.answer(function(err) {
		      if (err) {
			        throw err;
		      }
	    });
	 
	    bridge.create({type: 'mixing'}, function(err, bridge) {
		      if (err) {
			        throw err;
		      }
		 
		      console.log('Created bridge %s', bridge.id);
		 
		      addChannelsToBridge(channel, dialed, bridge);
	    });
  }
 
  // handler for the dialed channel leaving Stasis
  function dialedExit(dialed, bridge) {
	    console.log(
		        'Dialed channel %s has left our application, destroying bridge %s',
		        dialed.name, bridge.id);
	 
	    bridge.destroy(function(err) {
		      if (err) {
			        throw err;
		      }
	    });
  }
 
  // handler for new mixing bridge ready for channels to be added to it
  function addChannelsToBridge(channel, dialed, bridge) {
	    console.log('Adding channel %s and dialed channel %s to bridge %s',
		        channel.name, dialed.name, bridge.id);
	 
	    bridge.addChannel({channel: [channel.id, dialed.id]}, function(err) {
		      if (err) {
			        throw err;
		      }
	    });
  }
 
  client.on('StasisStart', stasisStart); 
  client.start('ivr');
}

}