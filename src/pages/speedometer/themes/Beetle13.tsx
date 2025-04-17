import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';

export const Beetle13 = () => {
  const {speed} = useAppSelector(selectSpeedometer);

  return (
    <div id="beetle13" className="expand circular">
		<div style={{position: 'absolute', top: '12.5%', left: '0%', height: '75%', width: '100%', zIndex: 0}}>
			<RadialGauge
				needle={false}
				minValue={0}
				maxValue={260}
				majorTicks={['0', '', '20', '',  '40', '', '60', '', '80', '', '100', '', '120', '', '140', '', '160', '', '180', '', '200', '', '', '230', '', '', '']}
				minorTicks={1}
				exactTicks={false}
				strokeTicks={false}
				ticksAngle={200}
				startAngle={80}
				highlights={[]}
				numbersMargin={-28}
				fontNumbersSize={14}
				colorPlate="transparent"
				colorNumbers="#666666"
				colorBorderOuter="transparent"
				colorBorderOuterEnd="transparent"
				// borders={true}
				borderOuterWidth={90}
				borderMiddleWidth={0}
				borderInnerWidth={0}
			/>
		</div>

		<div className="expand" style={{position: 'relative', zIndex: 1}}>
			<RadialGauge
				value={speed}
				height={window.innerHeight}
				width={window.innerHeight}
				//   units="MPH"
				//   title="Speedometer"
				minValue={0}
				maxValue={160}
				
				majorTicks={[0, 20, 40, 60, 80, 100, 120, 140, 160]}
				minorTicks={4}
				strokeTicks={false}
				ticksAngle={200}
				startAngle={80}
				numbersMargin={-5}
				highlights={[{from: 0, to: 160, color: '#FFFFFF'}]}
				highlightsWidth={5}
				
				//   highlights={[{from: 14.5, to: 15.5, color: 'red'}, {from: 31, to: 32, color: 'red'}, {from: 47, to: 48, color: 'red'}]}

				colorPlate="transparent"
				colorNeedle="#FE0238"
				colorNeedleEnd="#FE0238"
				colorNeedleShadowUp="#FE0238"
				colorNeedleShadowDown="#FE0238"
				colorNumbers="#FFFFFF"
				colorMajorTicks="#000000"
				colorMinorTicks="#000000"
				colorBorderOuter="#000000"
				colorBorderOuterEnd="#000000"
				//   colorBorderMiddle="green"
				//   colorBorderMiddleEnd="green"
				//   colorBorderInner="red"
				//   colorBorderInnerEnd="red"
				colorNeedleCircleOuter="#666666"
				colorNeedleCircleOuterEnd="#333333"
				colorNeedleCircleInner="#000000"
				colorNeedleCircleInnerEnd="#000000"

				needleShadow={false}
				needleStart={0}
				needleEnd={93}
				needleCircleSize={14}

				borders={true}
				borderOuterWidth={0}
				borderMiddleWidth={0}
				borderInnerWidth={0}
			/>
		</div>

		<div style={{position: 'absolute', bottom: '10%', left: '25%', height: '30%', width: '50%', background: '#0e0e0e', color: '#FFFFFF', borderRadius: 20}}>
			Hello World
		</div>
	</div>
  );
};

export default Beetle13;