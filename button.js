var Led = require('./lib/Led')
var Switch = require('./lib/Switch')

var SWITCH = new Switch(24);
var LED = new Led(25);

SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  console.log(value)
  led.set(!led.status());
});
