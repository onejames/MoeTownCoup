var Gpio = require('onoff').Gpio;

module.exports = class Switch {
    constructor(pin) {
      this.SWITCH = new Gpio(pin, 'in', 'rising', {debounceTimeout: 10})
      this.SWITCH.writeSync(0)
    }

    status() {
        return this.SWITCH.readSync()
    }

    destroy() {
      this.SWITCH.unexport()
    }
}
