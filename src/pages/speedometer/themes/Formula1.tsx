import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';

import TopDownView from '../../../images/beetle-top-down.png';

export const Formula1 = () => {
  const {speed, rpm, fuel, headlights, turnSignal, checkEngine} = useAppSelector(selectSpeedometer);

  return (
    <div id="formula1" className="expand circular">
		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '10vh', left: 'CALC(50% - 3rem)'}}>
			<div className={`${turnSignal ? 'f1-light-green' : ''}`}>⬌</div>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '35vh', left: '5vh'}}>
			<label className="f1-label">Lights</label>
			<div className={`f1-light ${headlights ? 'f1-light-blue' : ''}`} />
		</div>
		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '55vh', left: '5vh'}}>
			<label className="f1-label">Pit</label>
			<div className={`f1-light ${checkEngine ? 'f1-light-red' : ''}`} />
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '25vh', left: '25vh'}}>
			<label className="f1-label">Speed</label>
			<div className="f1-value">{speed.toFixed(0)}</div>
		</div>
		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '45vh', left: '25vh'}}>
			<label className="f1-label">RPM</label>
			<div className="f1-value">{rpm.toFixed(0)}</div>
		</div>
		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '65vh', left: '25vh'}}>
			<label className="f1-label">Fuel To Finish</label>
			<div className="f1-value">{fuel.toFixed(0)}</div>
		</div>

		<div style={{position: 'absolute', top: '20vh', left: '60vh'}}>
			<img src={TopDownView} alt="Top-down View" />
		</div>
		<div style={{position: 'absolute', top: '21vh', left: '55vh'}}>
			<label className="f1-label">32</label>
		</div>
		<div style={{position: 'absolute', top: '21vh', left: '89vh'}}>
			<label className="f1-label">32</label>
		</div>
		<div style={{position: 'absolute', top: '58vh', left: '55vh'}}>
			<label className="f1-label">32</label>
		</div>
		<div style={{position: 'absolute', top: '58vh', left: '89vh'}}>
			<label className="f1-label">32</label>
		</div>
    </div>
  );
};

export default Formula1;