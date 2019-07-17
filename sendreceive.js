#!/usr/bin/env node
var amqp = require('amqplib');

// Configuration items
var thingy_uuid = 'c02afdf514cf'
var amqp_connnection = 'amqp://localhost:5672';

console.log('Button and Environment!');

function sendData(data) {
    amqp.connect(amqp_connnection).then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var q = 'thingy_data';
            var ok = ch.assertQueue(q, { durable: false });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function (msg) {
                console.log(" [x] Payload received %s", msg.content.toString());
            }, {
                    noAck: true
                });

            return ok.then(function (_qok) {
                ch.sendToQueue(q, Buffer.from(data));
                console.log("Sent '%s'", data);
                //return ch.close();
            });


        }).finally(/*function () { conn.close(); }*/);
    }).catch(console.warn);
}

function receive() {
    amqp.connect(amqp_connnection).then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var q = 'thingy_data';
            var ok = ch.assertQueue(q, { durable: false });

            ch.consume(q, 'thingy/led/set');
            conn.on('message', (topic, message) => {
                message = message.toString();
            
            
                console.log("Received " + topic + " - " + message);
            
                message = JSON.parse(message);
                 if (message.state && message.state === 'OFF') {
                   //thingy_local.led_off(); 
                   console.log("Led off");
                }
            
                if (message.state && message.state === 'ON') {
                       //thingy_local.led_set({r:200, g:200, b: 200});
                       console.log("Led on");
                 }
            });
        }).finally(/*function () { conn.close(); }*/);
    }).catch(console.warn);
}

receive();
sendData("blaaaaat");