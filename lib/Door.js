var Gpio = require('onoff').Gpio;

const EventEmitter = require('events');

module.exports = class Led extends EventEmitter {
    constructor(motor, openSw, closeSw) {
        super()
        this.motor = motor
        this.opensw = openSw
        this.closesw = closeSw
    }

    open() {
        this.motor.direction('cw')
        this.motor.run()

        this.closesw.SWITCH.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 1) {
            this.motor.stop()
            this.motor.disable()
            console.log('opened')
            this.emit('open')
          }
        })
    }

    close() {
        this.motor.direction('cw')
        this.motor.run()

        this.closesw.SWITCH.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 1) {
            this.motor.stop()
            this.motor.disable()
            console.log('closed')
            this.emit('closed')
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
            }
            if (this.closesw.readSync() === 0) {
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
