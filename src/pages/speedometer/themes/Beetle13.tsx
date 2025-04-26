import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import PositionedElement from '../../../components/layout/PositionedElement';
import Panel from '../../../components/layout/Panel';
import LayoutContainer from '../../../components/layout/LayoutContainer';

import '../../../css/beetle13.css';
import WeatherIcon from '../../../components/formatting/WeatherIcon';

export const Beetle13 = () => {
	const { speed, checkEngine, fuel, voltage, weather } = useAppSelector(selectSpeedometer);

	return (
		<LayoutContainer id="beetle13">
			<PositionedElement width="100%" height="100%" top="0" left="0">
				<RadialGauge
					height={window.innerHeight}
					width={window.innerWidth}
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
					borders={true}
					borderOuterWidth={window.innerHeight * 0.2}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement width="100%" height="100%" center>
				<RadialGauge
					value={speed}
					height={window.innerHeight}
					width={window.innerHeight}
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
			</PositionedElement>

			<PositionedElement width="50%" height="30%" bottom="10%" left="25%" center>
				<Panel width="100%" height="20%" background="#0e0e0e" noBorder center>
					<PositionedElement width="3rem" height="100%" top="0" left="5%" center>
						<label className="">{checkEngine ? '⚠' : ''}</label>
					</PositionedElement>
					<PositionedElement height="100%" center>
						{new Date().toTimeString().substring(0, 5)}
					</PositionedElement>
					<PositionedElement width="4rem" height="100%" top="0" right="5%" center style={{ textAlign: 'right' }}>
						<label className="">
							<WeatherIcon style={{ fontSize: '0.65em' }} /> {Math.round(weather.temperature)}°
						</label>
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
					<PositionedElement width="4rem" height="100%" top="0" right="5%" center>
						<label className="">{voltage.toFixed(2)}v</label>
					</PositionedElement>
				</Panel>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Beetle13;
