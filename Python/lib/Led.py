import RPi.GPIO as GPIO
import lib/LedStatus

class Person:
    def __init__(pin, status=LedStatus.OFF):
        self.pin = pin
        self.status = status
        self.setup()
        if self.status == LedStatus.OFF
            self.on()
        else
            self.off()

    def setup(self):
        GPIO.setup(self.pin, GPIO.OUT)

    def on(self):
        self.status
        GPIO.output(self.pin, GPIO.LOW)

    def off(self):
        self.status
        GPIO.output(self.pin, GPIO.LOW)
