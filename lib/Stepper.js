var Gpio = require('onoff').Gpio;

module.exports = class Stepper {
    constructor(stepPin, directionPin, enablePin) {
      this.STEP = new Gpio(stepPin, 'out')
      this.DIRECTION = new Gpio(directionPin, 'out')
      this.ENABLE = new Gpio(enablePin, 'out')
      this.run = false
    }

    enable() {
      this.ENABLE.writeSync(0)
    }
    disable() {
      this.ENABLE.writeSync(1)
    }

    direction(dir='cw') {
      if(dir == 'cw') {
          this.DIRECTION.writeSync(1)
      } else {
          this.DIRECTION.writeSync(0)
      }
    }

    step() {
      if (this.STEP.readSync() === 0) {
        this.STEP.writeSync(1)
      } else {
        this.STEP.writeSync(0)
      }
    }

    run() {
      this.run = true
      this.MOTOR.enable()
      return this.running()
    }

    stop() {
      this.run = false
    }

    running() {
      if (!this.run) {
        return disable()
      }

      this.STEP.read()
        .then(_ => this.step() )
        .then(_ => setTimeout(this.run, 25) )
    }

    destroy() {
      this.STEP.unexport();
      this.DIRECTION.unexport();
      this.ENABLE.unexport();
    }
}
