import * as React from 'react';
import area from '@turf/area';

const eventNames = ['onDragStart', 'onDrag', 'onDragEnd'];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

function ControlPanel(props) {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  const controlPanelStyles = {
    top: '100px',
  }
  return (
    <div className="control-panel" style={controlPanelStyles}>
      <h3>Mission Control</h3>
      {polygonArea > 0 && (
        <p>
          {Math.round(polygonArea * 100) / 100} <br />
          square meters
        </p>
      )}
      <p>
        Soil Sampling Results
        <br />
        sampled on <b>April 23, 2023</b>.
      </p>
      <hr />
      <div className="input">
        <label>Phosphorus</label>
        <input
          type="checkbox"
          name="allday"
          checked={true}
        />
      </div>
      <div className="input">
        <label>Potassium</label>
        <input
          type="checkbox"
          name="allday"
          checked={true}
        />
      </div>
      <div className="input">
        <label>Nitrogen</label>
        <input
          type="checkbox"
          name="allday"
          checked={true}
        />
      </div>
      <div className={`input `}>
        <label>Opacity: </label>
        <input
          type="range"
          min={1}
          step={1}
        />
      </div>
      <hr />
      <div className="source-link">
        <a
          href="https://github.com/aoruize/hallyy/"
          target="_new"
        >
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
