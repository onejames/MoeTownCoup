var Gpio = require('onoff').Gpio;

module.exports = class Led {
    constructor(pin) {
      this.LED = new Gpio(pin, 'out')
      this.LED.writeSync(0)
    }

    on() {
      this.LED.writeSync(0)
    }

    off() {
      this.LED.writeSync(1)
    }

    status() {
        return this.LED.readSync() === 0
    }

    destroy() {
      this.LED.unexport()
    }
}
