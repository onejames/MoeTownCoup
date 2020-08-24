#!/usr/bin/env python
# from spinners import Spinners #Enum

import RPi.GPIO as GPIO
import time
import easydriver as ed

import lib/actions

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

def loop():
    while True:
        print(status)
        if status == 'closing' or status == 'opening':
            runMotor(10000)
        else:
            print Spinners.line.value
            time.sleep(.1)   # tick speed

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
