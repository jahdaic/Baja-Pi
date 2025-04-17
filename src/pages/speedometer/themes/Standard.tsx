import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';

export const Standard = () => {
  const {speed, rpm, turnSignal, checkEngine} = useAppSelector(selectSpeedometer);
  const fontFace = "Bebas Neue";
	const textColor = "#FFFFFF";
	const tickColor = "#FFFFFF";
	const needleColor = "#FFFFFF";
	const barFillColor = "#FFFFFF";
	const highlightColor = "#e62c0f";

  return (
    <div id="standard" className="expand circular">
		
		<div className="expand" style={{position: 'relative', zIndex: 1}}>
			<RadialGauge
				value={speed}
				height={window.innerHeight}
				width={window.innerHeight}
				units="MPH"
				fontUnits={fontFace}
				// title="Speedometer"
				fontTitle={fontFace}
				minValue={0}
				maxValue={80}
				
				majorTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
				minorTicks={2}
				strokeTicks={true}
				ticksAngle={180}
				startAngle={45}
				numbersMargin={5}
				highlights={[
					{from: 14.5, to: 15.5, color: highlightColor},
					{from: 31, to: 32, color: highlightColor},
					{from: 47, to: 48, color: highlightColor}
				]}
				highlightsWidth={8}
				
				colorPlate="transparent"
				colorTitle={textColor}
				colorUnits={textColor}
				colorNeedle={needleColor}
				colorNeedleEnd={needleColor}
				colorNeedleShadowUp="#FFFFFF"
				colorNeedleShadowDown="#FFFFFF"
				colorNumbers={textColor}
				colorMajorTicks={tickColor}
				colorMinorTicks={tickColor}
				colorBorderOuter="#000000"
				colorBorderOuterEnd="#000000"
				colorNeedleCircleOuter="#666666"
				colorNeedleCircleOuterEnd="#333333"
				colorNeedleCircleInner="#000000"
				colorNeedleCircleInnerEnd="#000000"

				fontNumbers={fontFace}
				fontNumbersSize={28}

				needleShadow={false}
				needleStart={0}
				needleEnd={93}
				needleType="line"
				needleCircleSize={14}
				needleCircleOuter={false}

				borders={false}
				borderOuterWidth={0}
				borderMiddleWidth={0}
				borderInnerWidth={0}
			/>
		</div>

		<div style={{position: 'absolute', top: '35%', left: '65%', height: '40vh', width: '40vh', zIndex: 1}}>
			<RadialGauge
				value={rpm / 1000}
				units="RPM"
				fontUnits={fontFace}
				// title="Speedometer"
				fontTitle={fontFace}
				minValue={0}
				maxValue={7}
				
				majorTicks={[0, 1, 2, 3, 4, 5, 6, 7]}
				minorTicks={2}
				strokeTicks={true}
				ticksAngle={180}
				startAngle={0}
				numbersMargin={5}
				highlights={[{from: 5.5, to: 7, color: 'red'}]}
				highlightsWidth={8}
				
				colorPlate="transparent"
				colorTitle={textColor}
				colorUnits={textColor}
				colorNeedle={needleColor}
				colorNeedleEnd={needleColor}
				colorNeedleShadowUp="#FFFFFF"
				colorNeedleShadowDown="#FFFFFF"
				colorNumbers={textColor}
				colorMajorTicks={tickColor}
				colorMinorTicks={tickColor}
				colorBorderOuter="#000000"
				colorBorderOuterEnd="#000000"
				colorNeedleCircleOuter="#666666"
				colorNeedleCircleOuterEnd="#333333"
				colorNeedleCircleInner="#000000"
				colorNeedleCircleInnerEnd="#000000"

				fontNumbers={fontFace}
				fontNumbersSize={28}

				needleShadow={false}
				needleStart={0}
				needleEnd={93}
				needleType="line"
				needleCircleSize={14}
				needleCircleOuter={false}

				borders={false}
				borderOuterWidth={0}
				borderMiddleWidth={0}
				borderInnerWidth={0}
			/>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '20vh', left: 'CALC(50% - 3rem)'}}>
			<div className={`standard-turn ${turnSignal ? 'f1-light-green' : ''}`}>⬌</div>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '68vh', left: 'CALC(50% - 3rem)'}}>
			<label className="standard-speed">{Math.round(speed)}</label>
		</div>

		<div className="centralized" style={{width: '6rem', position: 'absolute', top: '78vh', left: 'CALC(50% - 3rem)'}}>
			<label className="baja-check-engine">{checkEngine ? '⚠' : ''}</label>
		</div>
	</div>
  );
};

export default Standard;