var config = require('./config')

var outputs = require('./lib/outputs')
out = new outputs()

console.log('Booting Moe Town Coup...')

var Stepper = require('./lib/Stepper')
var Led = require('./lib/Led')
var Switch = require('./lib/Switch')
var Door = require('./lib/Door')

out.logo('0.0.3')
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

var processing = false
var statusOpen = () => {
  processing = false
  redLed.off()
  greenLed.on()
}
var statusClosed = () => {
  processing = false
  redLed.on()
  greenLed.off()
}

var blink = () => {
  if(!processing) {
    return
  }
  redLed.set(!redLed.status())
  greenLed.set(!greenLed.status())
  setTimeout(() => { blink() }, 250)
}
var inProcess = () => {
  processing = true
  redLed.on()
  greenLed.off()
  blink()
}
var openError = () => {
  setTimeout(() => { greenLed.off() }, 250)
  setTimeout(() => { greenLed.on() }, 500)
  setTimeout(() => { greenLed.off() }, 750)
  setTimeout(() => { greenLed.on() }, 1000)
  setTimeout(() => { greenLed.off() }, 1250)
  setTimeout(() => { greenLed.on() }, 1500)
}
var closeError = () => {
  setTimeout(() => { redLed.off() }, 250)
  setTimeout(() => { redLed.on() }, 500)
  setTimeout(() => { redLed.off() }, 750)
  setTimeout(() => { redLed.on() }, 1000)
  setTimeout(() => { redLed.off() }, 1250)
  setTimeout(() => { redLed.on() }, 1500)
}

door.on('open', () => {
  spinner.stop(true)
  console.log('Door is open')
  statusOpen()
  spinner.start()
})
door.on('closed', () => {
  spinner.stop(true)
  console.log('Door is closed')
  statusClosed()
  spinner.start()
})

greenSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    if(door.status() == 'OPEN') {
      openError()
      return;
    }
    if(door.status() == 'MOVING') {
      console.log('Requested to open while moving')
      return;
    }
    inProcess()
    spinner.stop(true)
    console.log('green button press')
    door.open()
    spinner.start()
  }
});
redSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err;
  }
  if(value === 1) {
    if(door.status() == 'CLOSED') {
      closeError()
      return;
    }
    if(door.status() == 'MOVING') {
      console.log('Requested to close while moving')
      return;
    }
    inProcess()
    spinner.stop(true)
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

const Si7021 = require('./lib/si7021-sensor');

const readSensorData = () => {
  si7021.readSensorData()
    .then((data) => {
      spinner.stop(true)
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      spinner.start()
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`Si7021 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

si7021.reset()
  .then((result) => readSensorData())
  .catch((err) => console.error(`Si7021 reset failed: ${err} `));

process.on('SIGINT', _ => {
  spinner.stop(true)
  console.log('\r\n Bye!')
  door.destroy()
  greenSw.destroy()
  redSw.destroy()
  greenLed.destroy()
  redLed.destroy()
});

spinner.start()
