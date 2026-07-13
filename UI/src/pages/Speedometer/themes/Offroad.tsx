import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import WeatherIcon from '../../../components/formatting/WeatherIcon';
import * as Icon from 'react-bootstrap-icons';

import '../../../css/offroad.css';

export const Offroad = () => {
	const { speed, location, weather } = useAppSelector(selectSpeedometer);
	const fontFace = 'Bebas Neue';
	const textColor = '#FFFFFF';
	const tickColor = '#FFFFFF';
	const needleColor = '#e62c0f';
	const highlightColor = '#e62c0f';

	return (
		<LayoutContainer id="offroad">
			<PositionedElement
				width="100%"
				height="100%"
				center
				className="gauge-glow"
				style={{
					background: 'linear-gradient(to bottom, rgba(15,32,57,1) 0%, rgba(0,4,25,1) 100%)',
				}}
			>
				<RadialGauge
					value={speed}
					height={window.innerHeight}
					width={window.innerHeight}
					units="MPH"
					fontUnits={fontFace}
					fontTitle={fontFace}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_SPEED_LIMIT || 80)}
					majorTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
					minorTicks={4}
					strokeTicks={false}
					ticksAngle={240}
					startAngle={60}
					numbersMargin={3}
					highlights={[]}
					highlightsWidth={7}
					colorPlate="transparent"
					colorTitle={textColor}
					colorUnits={textColor}
					colorNeedle={needleColor}
					colorNeedleEnd={needleColor}
					colorNeedleShadowUp={needleColor}
					colorNeedleShadowDown={needleColor}
					colorNumbers={textColor}
					colorMajorTicks={tickColor}
					colorMinorTicks={tickColor}
					colorBarStroke="#d2d2d2"
					colorBarProgress="red"
					colorBorderOuter="#000000"
					colorBorderOuterEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={24}
					needle={false}
					needleShadow={false}
					needleStart={30}
					needleEnd={93}
					needleWidth={8}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					barStrokeWidth={0}
					barWidth={0}
					barProgress={false}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement
				width="100%"
				height="100%"
				center
				style={
					{
						// background: 'linear-gradient(to bottom, rgba(15,32,57,1) 0%, rgba(0,4,25,1) 100%)',
						// backgroundImage: `url('${MetalBG}')`,
						// backgroundPosition: 'center center',
						// backgroundRepeat: 'no-repeat',
						// backgroundSize: 'cover',
					}
				}
			>
				<RadialGauge
					value={location.speed}
					height={window.innerHeight}
					width={window.innerHeight}
					units="MPH"
					fontUnits={fontFace}
					// title="Speedometer"
					fontTitle={fontFace}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_SPEED_LIMIT || 80)}
					majorTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
					minorTicks={4}
					strokeTicks={false}
					ticksAngle={240}
					startAngle={60}
					numbersMargin={3}
					highlights={[
						{ from: 19.5, to: 20.5, color: highlightColor },
						{ from: 33.5, to: 34.5, color: highlightColor },
						{ from: 49.5, to: 50.5, color: highlightColor },
					]}
					highlightsWidth={7}
					colorPlate="transparent"
					colorTitle={textColor}
					colorUnits={textColor}
					colorNeedle={needleColor}
					colorNeedleEnd={needleColor}
					colorNeedleShadowUp={needleColor}
					colorNeedleShadowDown={needleColor}
					colorNumbers={textColor}
					colorMajorTicks={tickColor}
					colorMinorTicks={tickColor}
					// colorBar={'#7D769A'}
					colorBarStroke="#d2d2d2"
					colorBarProgress="red"
					colorBorderOuter="#000000"
					colorBorderOuterEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={24}
					needleShadow={false}
					needleStart={30}
					needleEnd={93}
					needleWidth={8}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					barStrokeWidth={0}
					barWidth={0}
					barProgress={false}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			{/* <PositionedElement width="100%" height="100%" center>
				<RadialGauge
					value={25}
					height={window.innerHeight}
					width={window.innerHeight}
					units="MPH"
					fontUnits={fontFace}
					// title="Speedometer"
					fontTitle={fontFace}
					minValue={0}
					maxValue={100}
					majorTicks={[]}
					// minorTicks={4}
					strokeTicks={false}
					ticksAngle={90}
					startAngle={315}
					numbersMargin={3}
					highlights={
						[
							// { from: 14.5, to: 15.5, color: highlightColor },
							// { from: 31, to: 32, color: highlightColor },
							// { from: 47, to: 48, color: highlightColor },
						]
					}
					highlightsWidth={5}
					colorPlate="transparent"
					colorTitle={textColor}
					colorUnits={textColor}
					colorNeedle={highlightColor}
					colorNeedleEnd={highlightColor}
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
					colorBar={tickColor}
					fontNumbers={fontFace}
					fontNumbersSize={24}
					needleShadow={false}
					needleStart={84}
					needleEnd={95}
					needleWidth={3}
					needleType="needle"
					needleCircleSize={14}
					needleCircleOuter={false}
					barProgress={true}
					barWidth={10}
					// barStrokeWidth={3}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement> */}

			<PositionedElement
				width="60%"
				height="60%"
				top="CALC(50% - 30%)"
				left="CALC(50% - 30%)"
				className="smooth-rotate circular expand"
				style={{
					background:
						'linear-gradient(135deg, rgba(0,4,25,1) 0%, rgba(0,4,25,1) 40%, rgba(15,32,57,1) 54%, rgba(15,32,57,1) 100%)',
					// boxShadow: 'inset 0px 0px 4px 1px rgba(255,255,255,0.10), 0px 0px 0px 10px rgba(0,0,0,1)',
					boxShadow: '0px 10px 40px 10px rgba(0,4,25,1), inset 0px 0px 4px 1px rgba(255,255,255,0.17)',
				}}
				center
			>
				<div className="smooth-rotate expand" style={{ transform: `rotate(${-location.heading}deg)` }}>
					<RadialGauge
						value={0}
						// height={window.innerHeight}
						// width={window.innerHeight}
						// units="MPH"
						fontUnits={fontFace}
						// title="Speedometer"
						fontTitle={fontFace}
						minValue={0}
						maxValue={8}
						majorTicks={['S', '', 'W', '', 'N', '', 'E', '', '']}
						minorTicks={2}
						strokeTicks={false}
						ticksAngle={360}
						startAngle={0}
						numbersMargin={3}
						highlights={[{ from: 3.97, to: 4.03, color: highlightColor }]}
						highlightsWidth={15}
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
						fontNumbers={fontFace}
						fontNumbersSize={24}
						needleShadow={false}
						needleStart={0}
						needleEnd={0}
						needleWidth={8}
						needleType="arrow"
						needleCircleSize={0}
						needleCircleOuter={false}
						borders={false}
					/>
				</div>
			</PositionedElement>

			<PositionedElement width="8rem" top="31vh" left="CALC(50% - 4rem)" center>
				<Icon.TriangleFill />
			</PositionedElement>

			<PositionedElement width="30%" height="30%" top="CALC(50% - 15%)" left="CALC(50% - 15%)" center>
				<div
					className="circular expand centralized"
					style={{
						background: 'linear-gradient(to bottom, rgba(15,32,57,1) 0%, rgba(0,4,25,1) 100%)',
						boxShadow: '0px 10px 40px 10px rgba(0,4,25,1), inset 0px 0px 4px 1px rgba(255,255,255,0.10)',
					}}
				>
					<div className="centralized">
						{weather.icon && (
							<div>
								<WeatherIcon className="offroad-weather-icon svg-glow" />
								<WeatherIcon className="offroad-weather-icon" />
							</div>
						)}
						<span className="offroad-weather">&nbsp;{Math.round(weather.feelsLike)}°</span>
					</div>
					{/* <div className="offroad-weather-description">{weather.description}</div> */}
				</div>
			</PositionedElement>

			<PositionedElement width="8rem" top="85vh" left="CALC(50% - 4rem)" center>
				<label className="offroad-speed" style={{ display: 'inline-block' }}>
					{Math.round(location.speed)}
				</label>
				<span>MPH</span>
			</PositionedElement>

			<PositionedElement width="8rem" top="77vh" left="CALC(50% - 4rem - 8.5rem)" center>
				<div>
					<label className="offroad-speed" style={{ display: 'inline-block' }}>
						{Math.round(location.altitude)}
					</label>
					<span> ft</span>
				</div>
				<span>Altitude</span>
			</PositionedElement>

			<PositionedElement width="8rem" top="77vh" left="CALC(50% - 4rem + 8.5rem)" center>
				<div>
					<label className="offroad-speed" style={{ display: 'inline-block' }}>
						{Math.round(weather.rain)}
					</label>
					<span> %</span>
				</div>
				<span>Rain</span>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Offroad;
