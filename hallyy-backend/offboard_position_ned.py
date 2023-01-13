#!/usr/bin/env python3

"""
Caveat when attempting to run the examples in non-gps environments:
`drone.offboard.stop()` will return a `COMMAND_DENIED` result because it
requires a mode switch to HOLD, something that is currently not supported in a
non-gps environment.
"""

import asyncio

from mavsdk import System
from mavsdk.offboard import (OffboardError, PositionNedYaw)


async def run():
    """ Does Offboard control using position NED coordinates. """

    drone = System()
    await drone.connect(system_address="udp://:14540")

    print("Waiting for drone to connect...")
    async for state in drone.core.connection_state():
        if state.is_connected:
            print(f"-- Connected to drone!")
            break

    print("Waiting for drone to have a global position estimate...")
    async for health in drone.telemetry.health():
        if health.is_global_position_ok and health.is_home_position_ok:
            print("-- Global position estimate OK")
            break

    print("-- Arming")
    await drone.action.arm()

    print("-- Setting initial setpoint")
    # position N, position E, position Down (negative values = positive altitude), Angle of drone
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, 0.0, 0.0))

    print("-- Starting offboard")
    try:
        await drone.offboard.start()
    except OffboardError as error:
        print(f"Starting offboard mode failed with error code: {error._result.result}")
        print("-- Disarming")
        await drone.action.disarm()
        return

    print("-- Takeoff")
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, -5.0, 0.0))
    await asyncio.sleep(20)

    print("-- Go to Waypoint 1")
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 0.0, -5.0, 90.0))
    await asyncio.sleep(20)

    print("-- Sample Soil Waypoint 1")
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 0.0, -0.1, 90.0))
    await asyncio.sleep(20)
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 0.0, -5.0, 90.0))
    await asyncio.sleep(10)

    print("-- Go to Waypoint 2")
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 5.0, -5.0, 180.0))
    await asyncio.sleep(20)

    print("-- Sample Soil Waypoint 2")
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 5.0, -0.1, 180.0))
    await asyncio.sleep(20)
    await drone.offboard.set_position_ned(PositionNedYaw(5.0, 5.0, -5.0, 180.0))
    await asyncio.sleep(5)

    print("-- Go to Waypoint 3")
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 5.0, -5.0, 270.0))
    await asyncio.sleep(20)

    print("-- Sample Soil Waypoint 3")
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 5.0, -0.1, 27.0))
    await asyncio.sleep(20)
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 5.0, -5.0, 270.0))
    await asyncio.sleep(5)

    print("-- Return to Home")
    await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, -5.0, 0.0))
    await asyncio.sleep(20)

    print("-- Landing")
    #await drone.offboard.set_position_ned(PositionNedYaw(0.0, 0.0, 0.0, 0.0))
    await drone.action.land()
    await asyncio.sleep(20)
    print("-- Stopping offboard")
    try:
        await drone.offboard.stop()
    except OffboardError as error:
        print(f"Stopping offboard mode failed with error code: {error._result.result}")


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
