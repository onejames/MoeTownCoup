var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var Stepper = require('./lib/Stepper')

const motor = new Stepper(21, 22, 19)

// var RedLed = new Gpio(25, 'out');
//
// GreenLed = 26
// GreenOpenBtn = 24
// CloseSw = 4
//
// RedLed = 25
// RedCloseBtn = 23
// OpenSw = 5
//
// status = 'open' # open / opening / closed / closing


motor.direction('cw')
motor.enable()

var stepInterval = setInterval(function(){motor.step()}, 50)

setTimeout(motor.destroy, 5000);

clearInterval(stepInterval);
