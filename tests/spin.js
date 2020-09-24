// 200 steps per rotation

var Stepper = require('../lib/Stepper')

// stepPin, directionPin, enablePin
const motor = new Stepper(21, 22, 20)
var count = 0;

motor.enable()
motor.direction('cw')
motor.run()
