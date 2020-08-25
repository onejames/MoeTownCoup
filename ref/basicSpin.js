// 200 steps per rotation

const Gpio = require('../onoff').Gpio;

const STEP = new Gpio(21, 'out')
const DIRECTION = new Gpio(22, 'out')
const ENABLE = new Gpio(19, 'out')

DIRECTION.writeSync(1)
ENABLE.writeSync(0)

var stepInterval = setInterval(setp, 50)

function setup() {

}

function setp() {
  if (STEP.readSync() === 0) {
    STEP.writeSync(1)
  } else {
    STEP.writeSync(0)
  }
}

function endStep() {
  clearInterval(stepInterval);
  STEP.unexport();
  DIRECTION.unexport();
  ENABLE.unexport();
}

setTimeout(endStep, 5000); //stop blinking after 5 seconds
