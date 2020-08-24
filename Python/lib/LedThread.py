import threading, time
from random import randint

def flashLed(e, t):
    """flash the specified led every second"""
    while not e.isSet():
        print(colour)
        time.sleep(0.5)
        event_is_set = e.wait(t)
        if event_is_set:
            print('stop led from flashing')
        else:
            print('leds off')
            time.sleep(0.5)

colour = "red"
e = threading.Event()
t = threading.Thread(name='non-block', target=flashLed, args=(e, 2))
t.start()

for i in range(0, 10):
    # Randomly assign red or green every 10 seconds
    randomNumber = randint(0,10)
    print(randomNumber)
    if(randomNumber < 5):
        colour = "green"
    else:
        colour = "red"
    time.sleep(10)

e.set()
