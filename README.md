# HALLYY
HALLYY Agricultural drone soil sampling project  
Video Presentation: https://www.youtube.com/watch?v=CeaDzJ1-T0U&ab_channel=MatthewAo 

## Solution Breakdown
Our proposed solution allows for a highly automated method of collecting soil samples from farms, with an emphasis on ease of user control. This solution combines a front-end UI with a drone autopilot and planning system. This allows a drone, equipped with a custom-designed sampling device, to survey a field and collect samples at a specified precision without needing the overhead cost of a human operator.

### Frontend Webapp

We’ve built an end-to-end drone software system, from a custom consumer-facing web app to a drone autopilot and mission control software in the backend. 

Currently, our front end allows a user to pan and zoom into their farmland from a satellite view. With our intuitive UI, they can easily select the area of soil they want to be sampled by drawing a polygon shape. Our web app automatically populates the selected area with a grid of markers that can then be dragged around individually, each representing a sampling coordinate. 

### Backend Mission Planning

Once the user is satisfied, all they need to do is click Start Soil Sampling, and the coordinates are sent to our backend Python server. An optimal flight path is then determined to allow the drone to sample all the desired points in the shortest time. The backend then converts this flight path into a format compatible with the ardupilot drone control suite. As an appropriate drone would be prohibitively expensive at this stage, with models over $8,000, the backend is currently set up to test the proposed mission plan in Gazebo, a simulation software.

Ultimately, the intention is for the server to relay these commands to the corresponding drone platform that is sent to the user, as well as collect telemetry data based on drone performance. It will also store the results of the soil sampling from laboratory testing, and provide this information to the front end to produce an easy-to-understand map of soil characteristics for the end user.

### Physical Drone Platform and Sampler

The drone platform consists of an existing heavy-lift drone, with the sampling apparatus attached. The sampling apparatus consists of a rotating carousel of sampling probes - steel tubes measuring 30cm x 2cm - and a retrieval vehicle from which these probes can be inserted or extracted. This vehicle can then be lowered down by a motorized winch to the ground, at which time it would anchor itself using deployable legs and drive the probe into the soil to collect a sample. After collection, it would be retrieved by the winch, the old probe containing the sample will be extracted, and a new probe will be inserted, readying the device for the next sampling location. The drone would move along the planned path, stopping at the desired locations to perform the above procedure.

A future feature to implement in the drone control would be allowing the drone to return to a home base that is deployed on site, where it can be provided new batteries. This would allow the drone longer range and the ability to service larger farms.

### CAD Model of Functional Components of Sampler
<img src="https://github.com/aoruize/hallyy/blob/main/Physical%20Device.png" height="300">

## Technologies

### Architecture Diagram
![architecture diagram](https://github.com/aoruize/hallyy/blob/main/Architecture%20Diagram.png)

### Frontend Technologies
Our web-app front end is built using React, TypeScript, CSS, and Webpack. The front end features an open-source mapping library called Mapbox GL. 

The frontend source code is split into 5 main TypeScript files: 

- app.tsx
- control-panel.tsx
- draw-control.ts
- pin.tsx
- polygon-utils.ts

App.tsx contains the main app, including the navigation header, buttons, and map components. It handles clicking, panning, zooming, dragging, and drawing events in custom functions. This file also contains the code for determining when a polygon has been drawn, for generating marker locations inside the polygon when the "Generate Locations" button is clicked, and for sending those locations to our backend server upon clicking the "Start Sampling Soil" button.

Control-panel.tsx contains the React component for displaying the Mission Control UI panel. It currently shows information about how much area is selected within a polygon, although we plan to add more in-depth functionality and data, such as coordinates of all autogenerated marker locations.

Draw-control.ts contains the TypeScript code for handling and updating the drawing of the polygon, by using MapboxDraw from @mapbox/mapbox-gl-draw.

Pin.tsx contains the React component for displaying pin markers on the map.

Polygon-utils.ts contains the TypeScript algorithms for calculating the center point of any drawn polygon, thereby giving the location coordinates to send to the backend. This is where we plan on writing a more complex algorithm for determining how to disseminate the points in any drawn area in an even distribution across the polygon. 

### Frontend Instructions

Clone the repository. Navigate into the hallyy-frontend directory, and run the following command to install all dependencies:

```
npm i
```

Then, run the React app on local development using the following command:

```
npm run start
```

Now, you should be able to access the app in your browser at the URL `localhost:8080`.

### Backend Technologies
Our backend is currently written in Python and uses several open-source libraries, including Pymavlink, Gazebo, and PX4. These are open-source libraries for mission planning and communicating with industry-standard drones. 

Our backend is currently split into two files: 

- offboard_position_ned.py
- mission.py

offboard_position_ned.py contains the code for simulating a flying drone in a square given 4 coordinate locations, stopping at each corner to drop to the ground and sample the soil.

mission.py is still in prototype mode, although we are writing the code for automating a pymavlink mission based on GPS coordinates sent via API calls from the front end.

### Backend Instructions
To run our drone simulation, download the px4 codebase and gazebo drone simulator and run the px4 software in the loop build.
Then, navigate into hallyy-backend to execute the backend pymavlink scripts.

The download links can be found here:

- Pymavlink: https://github.com/ArduPilot/pymavlink/
- Gazebo simulator: https://docs.px4.io/main/en/simulation/gazebo.html
- PX4 Software in the Loop: https://docs.px4.io/main/en/simulation/

To use QGroundControl, directly download the app from the internet and follow the instructions on their documentation: https://docs.qgroundcontrol.com/master/en/

### Drone and Sampler Technologies
The Yangda YD6-1600S Heavy Lift platform, or similar, would be desirable for this applicaiton, due to its extended battery life (45 minutes with 5kg payload), notable weight capacity, and lower price point of $8000 compared to a similar DJI drone. The selection of an existing product allows us to take advantage of advances in drone control and range without investing signficant development time. Its "Launch" flight planner software is also based on ardupilot mission planner, which allows for compatibility with our tech stack.

The retreival mechanism is currently designed to be controlled with arduino for motor control, and a raspberry pi for higher level logic, communication with the drone and radio transmitter, and coordination of motors and sensors. These were chosen to accelerate development times and rapid prototyping, although a custom PCB with embedded hardware could be implemented in the future for power saving.

## Closing Notes

### Authors
Matthew Ao, Daniel Han, Gloria Yang, Julia Li, Tian Yu, Tony Liu

### Acknowledgements
We would like to give acknowledgement to the open source React MapboxGL library, the PX4 open source drone control software, as well as the gazebo simulation suite for allowing physical simulation of the drone system.



