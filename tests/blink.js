var Led = require('./lib/Led')

var LED = new Led(25);

var blinkInterval = setInterval(blinkLED, 250);

function blinkLED() {
  if (LED.status() === false) {
    LED.on()
  } else {
    LED.off()
  }
}

function endBlink() {
  LED.destroy()
}

setTimeout(endBlink, 5000)
