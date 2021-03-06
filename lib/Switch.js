var Gpio = require('onoff').Gpio;

module.exports = class Switch {
    constructor(pin) {
      this.SWITCH = new Gpio(pin, 'in', 'both', {debounceTimeout: 15})
    }

    status() {
        return this.SWITCH.readSync()
    }

    destroy() {
      this.SWITCH.unexport()
    }
}
