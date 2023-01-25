import * as React from 'react';
import {useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import Map, {Marker, NavigationControl} from 'react-map-gl';
import Button from 'react-bootstrap/Button';


import Pin from './pin';
import DrawControl from './draw-control';
import ControlPanel from './control-panel';
import { calculatePolygonCenter } from './polygon-utils';

import type {MarkerDragEvent, LngLat} from 'react-map-gl';

const TOKEN = 'pk.eyJ1IjoibWF0dGhld2FvIiwiYSI6ImNsY3BoYXoyejFkM2UzbnA2OGlnZjJjdjgifQ.XfOl2pfREnD9xWiGs163OA'; // Set your mapbox token here

const INITIAL_LATITUDE = 44.1257143;
const INITIAL_LONGITUDE = -79.3478998;
const MARKER_COUNT = 8;
const MARKER_SPACING = 0.001;

const initialMarkers = Array.from({length: MARKER_COUNT}, (_, i) => ({
  latitude: INITIAL_LATITUDE - (i % 4) * MARKER_SPACING,
  longitude: INITIAL_LONGITUDE - (i / 4 | 0) * MARKER_SPACING,
  events: {},
}));


export default function App() {
  const [markers, setMarkers] = useState([]);
  // function to handle button click
  const handleButtonClick = () => {
    let polygon = null;
    console.log('click');
    for (const featureId in features) {
        const feature = features[featureId];
        if (feature.geometry.type === 'Polygon') {
            polygon = feature;
            break;
        }
    }
    if (!polygon) {
        // show an error message or a warning
        return;
    }
    // calculate center point of polygon
    console.log(polygon.geometry.coordinates)
    const center = calculatePolygonCenter(polygon.geometry.coordinates);
    const initialMarkers = Array.from({length: MARKER_COUNT}, (_, i) => ({
      latitude: center[1] - (i % 4) * MARKER_SPACING,
      longitude: center[0] - (i / 4 | 0) * MARKER_SPACING,
      events: {},
    }));
    console.log(center);
    setMarkers([{
      latitude: center[1],
      longitude: center[0],
      // other properties here
    }]);
    /* setMarkers(markers.map(m => {
        return {
            latitude: center[1],
            longitude: center[0],
            // other properties here
        }
      })); */
    }
  const onMarkerDragStart = useCallback((index: number, event: MarkerDragEvent) => {
    setMarkers(prevMarkers => {
      let newMarkers = [...prevMarkers];
      newMarkers[index] = {
        ...newMarkers[index],
        events: {...newMarkers[index].events, onDragStart: event.lngLat},
      };
      return newMarkers;
    });
  }, []);

  const onMarkerDrag = useCallback((index: number, event: MarkerDragEvent) => {
    setMarkers(prevMarkers => {
      let newMarkers = [...prevMarkers];
      newMarkers[index] = {
        ...newMarkers[index],
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        events: {...newMarkers[index].events, onDrag: event.lngLat},
      };
      return newMarkers;
    });
  }, []);

  const onMarkerDragEnd = useCallback((index: number, event: MarkerDragEvent) => {
    setMarkers(prevMarkers => {
      let newMarkers = [...prevMarkers];
      newMarkers[index] = {
        ...newMarkers[index],
        events: {...newMarkers[index].events, onDragEnd: event.lngLat},
      };
      return newMarkers;
    });
  }, []);

  const [features, setFeatures] = useState({});

  const onUpdate = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);
  
  const headerStyle = {
    height: "75px",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  };
  const menuStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  };

  const logoStyle = {
    color: "#80BF47",
    fontWeight: "bold",
    fontSize: "x-large",
    marginLeft: "20px"
  };

  const buttonStyle = {
    backgroundColor: "#80BF47",
    color: "white",
    padding: "10px 20px",
    margin: "0px 10px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer"
  };

  const mapStyle = {height: 'calc(100% - 75px)'};

  return (
    <>
      <header style={headerStyle}>
        <div style={logoStyle}>HALLYY</div>
        <div style={menuStyle}>
          <Button style={buttonStyle} onClick={handleButtonClick}>Mark Start Point</Button>{' '}
          <Button style={buttonStyle}>Start Soil Sampling</Button>{' '}
        </div>
      </header>
      <Map
        style={mapStyle}
        initialViewState={{
          latitude: INITIAL_LATITUDE,
          longitude: INITIAL_LONGITUDE,
          zoom: 17,
        }}
        mapStyle="mapbox://styles/matthewao/cldc133bu000d01p9if4221ep"
        mapboxAccessToken={TOKEN}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable
            onDragStart={event => onMarkerDragStart(index, event)}
            onDrag={event => onMarkerDrag(index, event)}
            onDragEnd={event => onMarkerDragEnd(index, event)}
          >
            <Pin size={20} />
          </Marker>
        ))}
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        
      </Map>
      <ControlPanel polygons={Object.values(features)} />
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
