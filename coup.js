// this needs re written as a real module

const EventEmitter = require('events')

var config = require('./config')

var outputs = require('./lib/outputs')
out = new outputs()

const Coup = {
  state: {
    status: null,
    temperature: null,
    humidity: null,
    envStatus: null
  }
}

const events = new EventEmitter()

console.log('Booting Moe Town Coup...')

var Stepper = require('./lib/Stepper')
var Led = require('./lib/Led')
var Switch = require('./lib/Switch')
var Relay = require('./lib/Relay')
var Door = require('./lib/Door')

out.logo('0.0.6')
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

// - - - - - - - - - - - - - COOP FUNCTIONALITY - - - - - - - - - - - - - - -

var processing = false
var statusOpen = () => {
  processing = false
  redLed.off()
  greenLed.on()
  events.emit('opened')
  Coup.state.status = 'open'
}
var statusClosed = () => {
  processing = false
  redLed.on()
  greenLed.off()
  events.emit('closed')
  Coup.state.status = 'closed'
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
  Coup.state.status = 'processing'
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
    throw err
  }
  if(value === 1) {
    if(door.status() == 'OPEN') {
      openError()
      return
    }
    if(door.status() == 'MOVING') {
      console.log('Requested to open while moving')
      return
    }
    inProcess()
    spinner.stop(true)
    console.log('green button press')
    door.open()
    spinner.start()
  }
})
Coup.open = () => {
    inProcess()
    spinner.stop(true)
    console.log('remote open requested')
    door.open()
    spinner.start()
}

redSw.SWITCH.watch((err, value) => {
  if (err) {
    throw err
  }
  if(value === 1) {
    if(door.status() == 'CLOSED') {
      closeError()
      return
    }
    if(door.status() == 'MOVING') {
      console.log('Requested to close while moving')
      return
    }
    inProcess()
    spinner.stop(true)
    door.close()
    spinner.start()
  }
})
Coup.close = () => {
    inProcess()
    spinner.stop(true)
    console.log('remote close requested')
    door.close()
    spinner.start()
}

// - - - -

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

// - - - - - - - - - - - - - - - ENVIROMENTAL - - - - - - - - - - - - - - - - -

console.log('Enviromental DHT22 and Relay...')

var bigRelay = new Relay(config.bigRelay)

var sensor = require("node-dht-sensor")


var processNewEnvData = () => {
  if(Coup.state.temperature == null){
    return
  }

  if(Coup.state.temperature > 25) {
    bigRelay.on()
    console.log('enabling fan')
    Coup.status.envStatus == 'heating'
  }
  if(Coup.state.temperature < 5) {
    bigRelay.on()
    console.log('enabling heater')
    Coup.status.envStatus == 'cooling'
  }
  if( Coup.state.temperature < 24 &&  Coup.state.temperature > 5 ) {
    bigRelay.off()
    Coup.status.envStatus == 'off'
  }
}

function readEnviroment() {
  sensor.read(22, config.DHT22, function(err, temperature, humidity) {
    if (!err) {
      Coup.state.humidity = humidity
      Coup.state.temperature =  temperature
      console.log('Reading the enviroment: H: '+humidity+', T: '+temperature)
      processNewEnvData()
    } else {
      console.log(err)
    }

    events.emit('envUpdate', Coup.state)
  })
}

readEnviroment()
setInterval(readEnviroment, 10000)

if(Coup.state.temperature == null) {
  console.log("No Enviromental data yet")
} else if(Coup.state.temperature > 20) {
  console.log("We are in cooling mode")
} else {
  console.log("We are in heating mode")
}

console.log('Enviromental online')

// - - -

process.on('SIGINT', _ => {
  spinner.stop(true)
  console.log('\r\n Bye!')
  door.destroy()
  greenSw.destroy()
  redSw.destroy()
  greenLed.destroy()
  redLed.destroy()
  process.exit(0)
})

spinner.start()

module.exports.Coup = Coup
module.exports.Spinner = spinner
module.exports.Events = events
