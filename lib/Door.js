var Gpio = require('onoff').Gpio;

module.exports = class Led {
    constructor(motor, openSw, closeSw) {
        this.motor = motor
        this.opensw = openSw
        this.closesw = closeSw
    }

    open() {
        this.motor.direction('cw')
        this.motor.run()

        this.closesw.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 1) {
            this.motor.stop()
            this.motor.disable()
          }
        })
    }

    close() {
        this.motor.direction('cw')
        this.motor.run()

        this.closesw.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 1) {
            this.motor.stop()
            this.motor.disable()
          }
        })
    }

    status() {
        if(this.opensw.readSync() === 0 && this.closesw.readSync() === 0) {
            return 'OPEN'
        }

        if(this.opensw.readSync() === 1) {
            if(this.closesw.readSync() === 1) {
                return 'CLOSED'
            } elseif (this.closesw.readSync() === 0) {
                return 'MOVING'
            }
        }

        return 'ERROR'
    }

    destroy() {
      this.motor.destroy()
      this.closesw.destroy()
      this.opensw.destroy()
    }
}
