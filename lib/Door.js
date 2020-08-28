var Gpio = require('onoff').Gpio;

const EventEmitter = require('events');

module.exports = class Door extends EventEmitter {
    constructor(motor, openSw, closeSw) {
        super()
        this.motor = motor
        this.opensw = openSw
        this.closesw = closeSw

        this.opensw.SWITCH.watch(()=>{this.opened})
        this.closesw.SWITCH.watch(()=>{this.closed})

        this.opensw.SWITCH.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 0) {
            this.motor.stop()
            this.motor.disable()
            this.emit('open')
          }
        })

        this.closesw.SWITCH.watch((err, value) => {
          if (err) {
            throw err;
          }
          if(value === 1) {
            this.motor.stop()
            this.motor.disable()
            this.emit('closed')
          }
        })
    }

    opened() {
        this.emit('open')
    }
    closed() {
        this.emit('closed')
    }

    open() {
        console.log('Opening')
        this.motor.direction('cw')
        this.motor.run()
    }

    close() {
        console.log('Closing')

        this.motor.direction('ccw')
        this.motor.run()
    }

    status() {
        if(this.motor.isRunning) {
console.log('Door Status: MOVING')
            return 'MOVING'
        }

        if(this.opensw.status() === 0 && this.closesw.status() === 0) {
console.log('Door Status: OPEN')
            return 'OPEN'
        }

        if(this.opensw.status() === 1) {
            if(this.closesw.status() === 1) {
console.log('Door Status: CLOSED')
                return 'CLOSED'
            }
            if (this.closesw.status() === 0) {
console.log('Door Status: MOVING')
                return 'MOVING'
            }
        }

console.log('Door Status: ERROR')
        return 'ERROR'
    }

    destroy() {
      this.motor.destroy()
      this.closesw.destroy()
      this.opensw.destroy()
    }
}
