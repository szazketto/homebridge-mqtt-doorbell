# homebridge-mqtt-doorbell
An homebridge plugin that creates a HomeKit Doorbell accessory mapped on a MQTT topic.
Based on https://github.com/goodfield/homebridge-mqtt-smoke-alarm

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.
The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-mqtt-doorbell) and should be installed "globally" by typing:

    npm install -g homebridge-mqtt-doorbell

# Configuration
Remember to configure the plugin in config.json in your home directory inside the .homebridge directory. Configuration parameters:
```javascript
{
  "accessory": "mqtt-doorbell",
  "name": "<name>",
  "url": "<url of the broker>", // i.e. "http://mosquitto.org:1883"
  "username": "<username>",
  "password": "<password>",
  "topic": "<topic to get the doorbell state>"
}
```
