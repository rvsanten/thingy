#!/usr/bin/env node
var Thingy = require('thingy52');
var amqp = require('amqplib');
var thingName = "";

var led_rgb = {
    r: 0,
    g: 0,
    b: 0
};

// Configuration items
var thingy_uuid = 'c02afdf514cf'
var amqp_connnection = 'amqp://pi:pi@52.59.199.28';

console.log('Button and Environment!');

function sendData(data) {
    amqp.connect(amqp_connnection).then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var q = 'thingy_data';
            var ok = ch.assertQueue(q, { durable: false });

            return ok.then(function (_qok) {
                ch.sendToQueue(q, Buffer.from(data));
                console.log("Sent '%s'", data);
                return ch.close();
            });
        }).finally(function () { conn.close(); });
    }).catch(console.warn);
}

function onButtonChange(state) {
    sendData('Thingy: ' + thingName + ' Button: ' + state);

    if (state == 'Pressed') {
        led_rgb.r = led_rgb.r + 15;
        led_rgb.g = led_rgb.g + 15;
        led_rgb.b = led_rgb.b + 15;

        if (led_rgb.r > 250) {
            red = 0;
            green = 0;
            blue = 0;
        }

        this.led_set(led_rgb, function (error) {
            console.log('LED color change: ' + error);
        });
    }
}

function onTemperatureData(temperature) {
    sendData('Thingy: ' + thingName + ' Temperature: ' + temperature);
}

function onPressureData(pressure) {
    sendData('Thingy: ' + thingName + ' Pressure sensor: ' + pressure);
}

function onHumidityData(humidity) {
    sendData('Thingy: ' + thingName + ' Humidity sensor: ' + humidity);
}

function onGasData(gas) {
    sendData('Thingy: ' + thingName + ' Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc);
}

function onDiscover(thingy) {
    thingName = thingy;
    console.log('Discovered: ' + thingName);

    if (thingy.uuid != thingy_uuid) {
        console.log('Wrong device, discovering again...');
        Thingy.discover(onDiscover);
        return;
    }

    thingy.on('disconnect', function () {
        console.log('Disconnected!');
    });

    thingy.connectAndSetUp(function (error) {
        console.log('Connected! ' + error);
        thingy.on('buttonNotif', onButtonChange);
        thingy.on('temperatureNotif', onTemperatureData);
        thingy.on('pressureNotif', onPressureData);
        thingy.on('humidityNotif', onHumidityData);
        thingy.on('gasNotif', onGasData);

        thingy.temperature_interval_set(10000, function (error) {
            if (error) {
                console.log('Temperature sensor configure! ' + error);
            }
        });
        thingy.pressure_interval_set(10000, function (error) {
            if (error) {
                console.log('Pressure sensor configure! ' + error);
            }
        });
        thingy.humidity_interval_set(10000, function (error) {
            if (error) {
                console.log('Humidity sensor configure! ' + error);
            }
        });
        thingy.gas_mode_set(2, function (error) {
            if (error) {
                console.log('Gas sensor configure! ' + error);
            }
        });
        thingy.button_enable(function (error) {
            console.log('Button enabled! ' + error);
        });
        thingy.temperature_enable(function (error) {
            console.log('Temperature sensor started! ' + ((error) ? error : ''));
        });
        thingy.pressure_enable(function (error) {
            console.log('Pressure sensor started! ' + ((error) ? error : ''));
        });
        thingy.humidity_enable(function (error) {
            console.log('Humidity sensor started! ' + ((error) ? error : ''));
        });
        thingy.gas_enable(function (error) {
            console.log('Gas sensor started! ' + ((error) ? error : ''));
        });
    });
}

console.log('Starting thingy device discovery!');
// Global discover 
// Thingy.discover(onDiscover);

// Targetted discover
Thingy.discoverById(thingy_uuid, onDiscover);