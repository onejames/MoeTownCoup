// 200 steps per rotation

var Stepper = require('../lib/Stepper')

const motor = new Stepper(21, 22, 20)

motor.enable()
motor.direction('cw')
var count = 0;

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
