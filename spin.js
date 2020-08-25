// 200 steps per rotation

require('./lib/Stepper')

const motor = new stepper(21, 22, 19)

motor.direction('cw')
motor.enable()

var stepInterval = setInterval(function(){motor.step()}, 50)

setTimeout(motor.destroy, 5000);

clearInterval(stepInterval);
