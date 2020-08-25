var Stepper = require('./lib/Stepper')
var Led = require('./lib/Led')
var Switch = require('./lib/Switch')
var Door = require('./lib/Door')

const motor = new Stepper(21, 22, 19)
motor.disable()

var redLed = new Led(25)
var redSw = new Switch(23)
var closeSw = new Switch(4)

var greenLed = new Led(26)
var greenSw = new Switch(24)
var openSw = new Switch(5)

var door = new Door(motor, openSw, closeSw)

// door.watch(err, value) => { value == 'closed' ?? redLed.on() greenLed.off() })
// door.watch(err, value) => { value == 'open' ?? redLed.off() greenLed.on() })

greenSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    door.open()
  }
});

redSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    door.close()
  }
});


process.on('SIGINT', _ => {
  door.destroy()
  greenSw.destroy()
  redSw.destroy()
  greenLed.destroy()
  redLed.destroy()
});
