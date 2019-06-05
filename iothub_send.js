#!/usr/bin/env node

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
 
var connectionString = 'HostName=thingyhub.azure-devices.net;DeviceId=thingy1;SharedAccessKey=4syURyK2szQ2NI7YPtpKYnlTIPzJuFpvfVPCP1J+1fY=';
 
var client = clientFromConnectionString(connectionString);

var connectCallback = function (err) {
    if (err) {
      console.error('Could not connect: ' + err);
    } else {
      console.log('Client connected');
      var message = new Message('some data from my device');
      client.sendEvent(message, function (err) {
        if (err) console.log(err.toString());
      });
   
      client.on('message', function (msg) { 
        console.log(msg); 
        client.complete(msg, function () {
          console.log('completed');
        });
      }); 
    }
  };

  client.open(connectCallback);
  client.sendEvent(new Message("blaat"));