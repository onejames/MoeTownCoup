var Gpio = require('onoff').Gpio;

module.exports = class Stepper {

    constructor(stepPin, directionPin, enablePin, sleep=0, reset=0, ms1=0, ms2=0, ms3=0, stepsPerRev=200) {
      this.STEP = new Gpio(stepPin, 'out')
      this.DIRECTION = new Gpio(directionPin, 'out')
      this.ENABLE = new Gpio(enablePin, 'out')

      if(sleep > 0) {
        this.SLEEP = new Gpio(sleep, 'out')
      }
      if(reset > 0) {
        this.RESET = new Gpio(reset, 'out')
      }
      if(ms1 > 0) {
        this.MS1 = new Gpio(ms1, 'out')
      }
      if(ms2 > 0) {
        this.MS2 = new Gpio(ms2, 'out')
      }
      if(ms3 > 0) {
        this.MS3 = new Gpio(ms3, 'out')
      }

      this.stepsPerRev = stepsPerRev

      this.isRunning = false
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
      this.STEP.writeSync(!this.STEP.readSync())
    }

    run() {
      this.isRunning = true
      console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
      this.enable()
      return this.running()
    }

    runSteps(steps) {
      for (var i = 0; i < steps; i++) {
          this.step()
      }
    }

    stop() {
      this.isRunning = false
    }

    rotate(degree) {
      // NOTE: Microstepping impacts this
      let steps = (this.stepsPerRev / 360) * degree

      if(steps > 0) {
        this.setDirection('cw')
      } else {
        this.setDirection('ccw')
      }

      return this.runSteps(steps)
    }

    running() {
      if (!this.isRunning) {
        return this.disable()
      }

      this.STEP.read()
        .then(_ => this.step() )
        .then(_ => setTimeout(() => { this.running() }, 5) )
        .catch((error) => { console.console.log(error) })
    }

    destroy() {
      this.STEP.unexport();
      this.DIRECTION.unexport();
      this.ENABLE.unexport();
    }
}
