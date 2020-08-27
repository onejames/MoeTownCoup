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
var runSpinner = () => {
  console.log('ctrl+c to exit')
  spinner.start()
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
  runSpinner()
})
door.on('closed', () => {
  spinner.stop(true)
  console.log('Door is closed')
  statusClosed()
  runSpinner()
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
    inProcess()
    spinner.stop(true)
    console.log('green button press')
    door.open()
    runSpinner()
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
    inProcess()
    spinner.stop(true)
    door.close()
    runSpinner()
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
