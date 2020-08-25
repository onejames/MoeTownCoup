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

    set(status=true) {
      if(status) {
        this.on()
      } else {
        this.off()
      }
    }

    status() {
        return this.LED.readSync() === 0
    }

    destroy() {
      this.off()
      this.LED.unexport()
    }
}
