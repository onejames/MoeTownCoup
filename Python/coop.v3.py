#!/usr/bin/env python

import RPi.GPIO as GPIO
import time
import easydriver as ed

stepper = None

GreenLed = 26
GreenOpenBtn = 24
CloseSw = 4

RedLed = 25
RedCloseBtn = 23
OpenSw = 5

status = 'open' # open / opening / closed / closing

def setup():
    global stepper
    GPIO.setmode(GPIO.BCM)
    stepper = ed.easydriver(21, 0.004, 22, 16, 20, 0, 0, 18, 0, 'door')
    GPIO.setup(GreenLed, GPIO.OUT)
    GPIO.setup(GreenOpenBtn, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(OpenSw, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.output(GreenLed, GPIO.HIGH)
    GPIO.setup(RedLed, GPIO.OUT)
    GPIO.setup(RedCloseBtn, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(CloseSw, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.output(RedLed, GPIO.HIGH)
    GPIO.add_event_detect(GreenOpenBtn, GPIO.FALLING, callback=open, bouncetime=200)
    GPIO.add_event_detect(OpenSw, GPIO.FALLING, callback=opened, bouncetime=200)
    GPIO.add_event_detect(RedCloseBtn, GPIO.FALLING, callback=close, bouncetime=200)
    GPIO.add_event_detect(CloseSw, GPIO.FALLING, callback=closed, bouncetime=200)

def open(ev=None):
    global status
    setMotorDirection('open')
    status = 'opening'
    print('opening')
    # start led blinking

def opened(ev=None):
    global status
    GPIO.output(GreenLed, GPIO.LOW)
    GPIO.output(RedLed, GPIO.HIGH)
    # stepper.sleep()
    status = 'opened'
    print('opened')

def close(ev=None):
    global status
    setMotorDirection('close')
    status = 'closing'
    print('closing')
    # start led blinking

def closed(ev=None):
    global status
    GPIO.output(RedLed, GPIO.LOW)
    GPIO.output(GreenLed, GPIO.HIGH)
    # stepper.sleep()
    status = 'closed'
    print('closed')

def runMotor(steps):
    for i in range(0,steps):
        stepper.step()

def setMotorDirection(dir):
    if dir == 'open':
        mdir = 1
    else if dir == 'close':
        mdir = 0
    stepper.set_half_step()
    stepper.set_direction(mdir)

def loop():
    while True:
        print(status)
        if status == 'closing' or status == 'opening':
            runMotor(10000)
        else:
            print Spinners.line.value
            time.sleep(.1)   # tick speed

def setStatus():
    if true:
        false

def destroy():
    GPIO.output(GreenLed, GPIO.HIGH)   # led off
    GPIO.output(RedLed, GPIO.HIGH)     # led off
    GPIO.cleanup()                     # Release resource
    stepper.finish()

if __name__ == '__main__':     # Program start from here
    setup()
    setStatus()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
