var Stepper = require('./lib/Stepper')
var Led = require('./lib/Led')
var Switch = require('./lib/Switch')
var Door = require('./lib/Door')

console.log('Booting Moe Town Coup')

const motor = new Stepper(21, 22, 19) // (stepPin, directionPin, enablePin, sleep=0, reset=0, ms1=0, ms2=0, ms3=0, stepsPerRev=200)
motor.disable()

var redLed = new Led(25)
var redSw = new Switch(23)
var closeSw = new Switch(4)

var greenLed = new Led(26)
var greenSw = new Switch(24)
var openSw = new Switch(5)

var door = new Door(motor, openSw, closeSw)

var statusOpen = () => {
  redLed.off()
  greenLed.on()
}
var statusClosed = () => {
  redLed.on()
  greenLed.off()
}

if(door.status() == 'OPEN') {
  statusOpen()
}
if(door.status() == 'CLOSED') {
  statusClosed()
}

door.on('open', () => {
  statusOpen()
})
door.on('closed', () => {
  statusClosed()
})

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
