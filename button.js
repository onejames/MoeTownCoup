var Led = require('./lib/Led')
var Switch = require('./lib/Switch')

var redLed = new Led(25);
var redSw = new Switch(23);

var greenSw = new Switch(24);
var greenLed = new Led(26);

greenSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  console.log(value)
  greenLed.set(!greenLed.status());
});

redSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  console.log(value)
  redLed.set(!redLed.status());
});
