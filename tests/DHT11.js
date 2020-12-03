var sensor = require("node-dht-sensor");

sensor.read(22, 16, function(err, temperature, humidity) {
  if (!err) {
    console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
  }
});

