import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import PositionedElement from '../../../components/layout/PositionedElement';
import Panel from '../../../components/layout/Panel';

export const Beetle13 = () => {
	const { speed, checkEngine, fuel, voltage, weather } = useAppSelector(selectSpeedometer);

	return (
		<div id="beetle13" className="expand circular">
			<div
				style={{
					position: 'absolute',
					top: '12.5%',
					left: '0%',
					height: '75%',
					width: '100%',
					zIndex: 0,
				}}
			>
				<RadialGauge
					needle={false}
					minValue={0}
					maxValue={260}
					majorTicks={[
						'0',
						'',
						'20',
						'',
						'40',
						'',
						'60',
						'',
						'80',
						'',
						'100',
						'',
						'120',
						'',
						'140',
						'',
						'160',
						'',
						'180',
						'',
						'200',
						'',
						'',
						'230',
						'',
						'',
						'',
					]}
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

			<div className="expand" style={{ position: 'relative', zIndex: 1 }}>
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
					highlights={[{ from: 0, to: 160, color: '#FFFFFF' }]}
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

			<PositionedElement width="50%" height="30%" bottom="10%" left="25%" center>
				<Panel width="100%" height="20%" background="#0e0e0e" noBorder center>
					<PositionedElement width="3rem" height="100%" top="0" left="10%" center>
						<label className="">{checkEngine ? '⚠' : ''}</label>
					</PositionedElement>
					{new Date().toTimeString().substring(0, 5)}
					<PositionedElement width="3rem" height="100%" top="0" right="10%" center>
						<label className="">{Math.round(weather.temperature)}°</label>
					</PositionedElement>
				</Panel>
				<Panel width="100%" height="60%" background="#0e0e0e" borderWidth="2px" noLeftBorder noRightBorder center>
					<span className="beetle13-speed">{speed.toFixed(0)}</span>
					<label>MPH</label>
				</Panel>
				<Panel width="100%" height="20%" background="#0e0e0e" noBorder center>
					<PositionedElement width="3rem" height="100%" top="0" left="5%" center>
						<label className="">{fuel.toFixed(0)}%</label>
					</PositionedElement>
					<PositionedElement width="3rem" height="100%" top="0" right="10%" center>
						<label className="">{voltage.toFixed(2)}v</label>
					</PositionedElement>
				</Panel>
			</PositionedElement>
		</div>
	);
};

export default Beetle13;
