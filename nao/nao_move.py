#!/usr/bin/env python2
import time
from naoqi import ALProxy
motionProxy = ALProxy("ALMotion", "192.168.1.13", 9559)
motionProxy.setStiffnesses("Head", 1.0)
names = "HeadPitch"
fractionMaxSpeed = 0.8
angles = 0.95
motionProxy.setAngles(names,angles,fractionMaxSpeed)
time.sleep(1.0)
angles = 0.0
motionProxy.setAngles(names,angles,fractionMaxSpeed)
time.sleep(1.0)
angles = 0.95
motionProxy.setAngles(names,angles,fractionMaxSpeed)
time.sleep(1.0)
angles = 0.0
motionProxy.setAngles(names,angles,fractionMaxSpeed)
motionProxy.setStiffnesses("Head", 0.0)