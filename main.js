var config = require('./config')

var outputs = require('./lib/outputs')
out = new outputs()

console.log('Booting Moe Town Coup...')

var Stepper = require('./lib/Stepper')
var Led = require('./lib/Led')
var Switch = require('./lib/Switch')
var Door = require('./lib/Door')

out.logo()
out.configTable(config)

spinner = out.spinner()

const motor = new Stepper(
    config.motor.stepPin,
    config.motor.directionPin,
    config.motor.enablePin
) // sleep=0, reset=0, ms1=0, ms2=0, ms3=0, stepsPerRev=200)
motor.disable()

console.log('Motor loaded...')

var redLed = new Led(config.redLed)
var redSw = new Switch(config.redSw)
var closeSw = new Switch(config.closeSw)

var greenLed = new Led(config.greenLed)
var greenSw = new Switch(config.greenSw)
var openSw = new Switch(config.openSw)

console.log('In\'s and outs loaded...')

var door = new Door(motor, openSw, closeSw)

console.log('Door initiated...')

var statusOpen = () => {
  redLed.off()
  greenLed.on()
}
var statusClosed = () => {
  redLed.on()
  greenLed.off()
}

door.on('open', () => {
  spinner.stop(true)
  statusOpen()
  spinner.start()
})
door.on('closed', () => {
  spinner.stop(true)
  statusClosed()
  spinner.start()
})

greenSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    spinner.stop(true)
    console.log('Opening')
    door.open()
    spinner.start()
  }
});
redSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    spinner.stop(true)
    console.log('Closing')
    door.close()
    spinner.start()
  }
});

console.log('Events registered...')

if(door.status() == 'OPEN') {
  console.log('Coup is open')
  statusOpen()
}
if(door.status() == 'CLOSED') {
  console.log('Coup is closed')
  statusClosed()
}

console.log('Status set')

process.on('SIGINT', _ => {
  door.destroy()
  greenSw.destroy()
  redSw.destroy()
  greenLed.destroy()
  redLed.destroy()
});

console.log('ctrl+c to exit')

spinner.start()
