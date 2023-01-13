# hallyy
HALLYY Agricultural drone soil sampling project 

# Tony Code Notes:
Pymavlink: https://github.com/ArduPilot/pymavlink/
Gazebo simulator: https://docs.px4.io/main/en/simulation/gazebo.html
PX4 Software in the Loop: https://docs.px4.io/main/en/simulation/
offboard_position_ned.py - adapted from pymavlink example code used for gazebo simulation demo video.
Fly drone in a square stopping at each corner to drop to the ground and sample the soil.

mission.py - Doesn't work, but will eventually use this format to directly create a pymavlink mission based on gps co-ordinates from frontend.

To run simulation, need to download px4 codebase and gazebo drone simulator and run the px4 software in the loop build.
Afterwards, we can execute the above pymavlink scripts.

For QGroundControl, directly download app from internet: https://docs.qgroundcontrol.com/master/en/
