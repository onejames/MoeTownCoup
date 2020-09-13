var Gpio = require('onoff').Gpio;

module.exports = class Led {
    constructor(pin) {
      this.RELAY = new Gpio(pin, 'out')
      this.RELAY.writeSync(0)
    }

    on() {
      this.RELAY.writeSync(0)
    }

    off() {
      this.RELAY.writeSync(1)
    }

    set(status=true) {
      if(status) {
        this.on()
      } else {
        this.off()
      }
    }

    status() {
        return this.RELAY.readSync() === 0
    }

    destroy() {
      this.off()
      this.RELAY.unexport()
    }
}
