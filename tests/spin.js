// 200 steps per rotation

var Stepper = require('../lib/Stepper')

// stepPin, directionPin, enablePin
const motor = new Stepper(21, 22, 20)
var count = 0;

motor.enable()
motor.direction('cw')

var stepInterval = setInterval(function(){
    if(count > 50) {
        motor.direction('ccw')
    }
    motor.step()
    count++
}, 50)

setTimeout(function(){
    motor.destroy()
}, 5000);

clearInterval(stepInterval);
