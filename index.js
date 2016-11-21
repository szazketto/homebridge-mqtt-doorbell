'use strict';
var inherits = require('util').inherits;
var Service, Characteristic;
var mqtt = require('mqtt');

//The whole plugin is based on https://github.com/goodfield/homebridge-mqtt-smoke-alarm

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-mqtt-doorbell', 'mqtt-doorbell', MqttDoorbellAccessory);
};

function MqttDoorbellAccessory(log, config) {
    this.log = log;
    this.name = config['name'];
    this.url = config['url'];
    this.client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
    this.options = {
        keepalive: 10,
        clientId: this.client_Id,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
            topic: 'WillMsg',
            payload: 'Connection Closed abnormally..!',
            qos: 0,
            retain: false
        },
        username: config['username'],
        password: config['password'],
        rejectUnauthorized: false
    };

    this.bellPressed = false;
    this.topic = config['topic'];


    this.service = new Service.Doorbell(this.options['name']);
    this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).on('get', this.getProgrammableSwitchEvent.bind(this));

    this.client = mqtt.connect(this.url, this.options);

    var self = this;

    this.client.on('error', function (err) {
        self.log('Error event on MQTT:', err);
    });

    this.client.on('message', function (topic, message) {
        if (topic == self.topic) {
            self.bellPressed = message.toString() === 'on' || message.toString() === 'true';
            self.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(self.bellPressed , undefined, undefined);
        }
    });

    this.client.subscribe(self.topic);
}

MqttDoorbellAccessory.prototype.getProgrammableSwitchEvent = function (callback) {
    callback(null, this.bellPressed);
};

MqttDoorbellAccessory.prototype.getServices = function () {
    return [this.service];
};