import RPi.GPIO as GPIO

import lib/Led as Led

GreenLed = Led(26)
GreenLed.on()
time.sleep(1)
GreenLed.off()
time.sleep(1)
GreenLed.on()
time.sleep(1)
GreenLed.off()
time.sleep(1)
GreenLed.on()
time.sleep(1)
GreenLed.off()
time.sleep(1)
