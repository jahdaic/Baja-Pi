import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';

export const LCD = () => {
	const {
		speed,
		rpm,
		fuel,
		oilTemperature,
		oilPressure,
		voltage,
		headlights,
		turnSignal,
		checkEngine,
		startTime
	} = useAppSelector(selectSpeedometer);

	const calculateTime = () => {
		const now = Date.now()
		
		const hours = Math.floor((now - startTime) / 1000 / 60 / 60);
		const minutes = Math.floor((now - startTime) / 1000 / 60) - (hours * 60);
		const seconds = Math.floor((now - startTime) / 1000) - (hours * 60 * 60) - (minutes * 60);

		console.log('TIME', hours, minutes, seconds);

		return `${hours < 10 ? '0'+hours: hours}:${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
	};


  return (
    <div id="lcd" className="expand circular">
		<RadialGauge
				needle={false}
				value={rpm / 1000}
				minValue={0}
				maxValue={Number(process.env.REACT_APP_RPM_LIMIT) / 1000}
				majorTicks={Array.from(Array(Number(process.env.REACT_APP_RPM_LIMIT) / 1000 + 1).keys())}
				minorTicks={10}
				exactTicks={false}
				strokeTicks={true}
				ticksAngle={100}
				startAngle={130}
				highlights={[{from: 0, to: rpm / 1000, color: 'currentcolor'}, /*{from: 5, to: 7, color: 'currentcolor'}*/]}
				highlightsWidth={14}
				numbersMargin={3}
				// barWidth={5}
				// barStrokeWidth={1}
				barProgress={false}
				fontNumbersSize={12}
				colorPlate="transparent"
				colorNumbers="currentcolor"
				colorMinorTicks="currentcolor"
				colorMajorTicks="currentcolor"
				// colorBar="transparent"
				
				// colorBorderOuter="transparent"
				// colorBorderOuterEnd="transparent"
				borders={false}
				// borderOuterWidth={0}
				// borderMiddleWidth={0}
				// borderInnerWidth={0}
		 />

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '18vh', left: 'CALC(50% - 3rem)'}}>
			<label className="lcd-label">RPM</label>
			<div className="lcd-value">{rpm.toFixed(0)}</div>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '25vh', left: 'CALC(50% - 3rem)'}}>
			<div className="lcd-turn">{turnSignal ? '⬌' : ''}</div>
		</div>


		<div className="" style={{width: '11rem', position: 'absolute', top: 'CALC(50% - 3rem)', left: 'CALC(50% - 5.5rem)'}}>
			<div className="lcd-speed lcd-value" data-unlit="ᛤᛤᛤ"><b>{speed.toFixed(0)}</b></div>
			<label className="lcd-label">MPH</label>
		</div>

		<div className="" style={{width: '5rem', position: 'absolute', top: '30vh', left: '15vh'}}>
			<label className="lcd-label">Fuel</label>
			<div className="lcd-value" data-unlit="ᛤᛤᛤ">{fuel.toFixed(0)}</div>
			<div className="lcd-suffix">%</div>
		</div>

		<div className="" style={{width: '5rem', position: 'absolute', top: '43vh', left: '3vh'}}>
			<label className="lcd-label">Pressure</label>
			<div className="lcd-value" data-unlit="ᛤᛤᛤ">{oilPressure.toFixed(0)}</div>
			<div className="lcd-suffix">PSI</div>
		</div>

		<div className="" style={{width: '5rem', position: 'absolute', top: '55vh', left: '15vh'}}>
			<label className="lcd-label">Temp</label>
			<div className="lcd-value" data-unlit="ᛤᛤᛤ">{oilTemperature.toFixed(0)}</div>
			<div className="lcd-suffix">°F</div>
		</div>

		<div className="" style={{width: '6rem', position: 'absolute', top: '30vh', right: '13vh'}}>
			<label className="lcd-label">Voltage</label>
			<div className="lcd-value" data-unlit="ᛤᛤᛤᛤ">{voltage.toFixed(1)}</div>
			<div className="lcd-suffix">V</div>
		</div>

		{/* <div className="centralized" style={{width: '6rem', position: 'absolute', top: '50vh', right: '0vh'}}>
			<label className="lcd-label">Voltage</label>
			<div className="lcd-value">{fuel.toFixed(0)}</div>
		</div> */}

		<div className="" style={{width: '12rem', position: 'absolute', top: '57vh', right: '2vh'}}>
			{/* <label className="lcd-label">Fuel</label>
			<div className="lcd-value">{fuel.toFixed(0)}</div> */}
			<div className="lcd-value" data-unlit="ᛤᛤ:ᛤᛤ:ᛤᛤ"><b>{calculateTime()}</b></div>
		</div>

		<div className="centralized" style={{width: '28rem', position: 'absolute', top: '68vh', left: '8vh'}}>
			<div className="lcd-value lcd-bottom" data-unlit="ᛤᛤᛤᛤᛤᛤᛤᛤᛤᛤᛤᛤᛤ">{'MAF 65488 G/S'}</div>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '82vh', left: '25vh'}}>
			<label className="lcd-label">{headlights ? 'HIGHBEAMS' : ''}</label>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '82vh', right: '25vh'}}>
			<label className="lcd-label">{checkEngine ? 'Check Engine!' : ''}</label>
		</div>

		<div className="centralized" style={{width: '10rem', position: 'absolute', top: '87vh', left: '25vh'}}>
			<label className="lcd-label">{oilTemperature >= Number(process.env.REACT_APP_OIL_TEMP_REDLINE) ? 'ENGINE OVERHEATING!' : ''}</label>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '87vh', right: '25vh'}}>
			<label className="lcd-label">{oilPressure <= Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? 'OIL PRESSURE!' : ''}</label>
		</div>
    </div>
  );
};

export default LCD;