import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import WeatherIcon from '../../../images/weather-test.svg';
// import MetalBG from '../../../images/radial-metal.png';

export const Offroad = () => {
	const { speed, fuel, location } = useAppSelector(selectSpeedometer);
	const fontFace = 'Bebas Neue';
	const textColor = '#FFFFFF';
	const tickColor = '#FFFFFF';
	const needleColor = '#e62c0f';
	const highlightColor = '#e62c0f';

	return (
		<LayoutContainer id="standard">
			<PositionedElement
				width="100%"
				height="100%"
				center
				style={{
					background: 'linear-gradient(to bottom, rgba(15,32,57,1) 0%, rgba(0,4,25,1) 100%)',
					// backgroundImage: `url('${MetalBG}')`,
					// backgroundPosition: 'center center',
					// backgroundRepeat: 'no-repeat',
					// backgroundSize: 'cover',
				}}
			>
				<RadialGauge
					value={speed}
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
					strokeTicks={true}
					ticksAngle={240}
					startAngle={60}
					numbersMargin={3}
					highlights={[
						{ from: 14.5, to: 15.5, color: highlightColor },
						{ from: 31, to: 32, color: highlightColor },
						{ from: 47, to: 48, color: highlightColor },
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
					barStrokeWidth={40}
					barWidth={0}
					barProgress={false}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement width="100%" height="100%" center>
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
			</PositionedElement>

			<PositionedElement
				width="60%"
				height="60%"
				top="CALC(50% - 30%)"
				left="CALC(50% - 30%)"
				className="smooth-rotate circular expand"
				style={{
					background:
						'linear-gradient(135deg, rgba(0,4,25,1) 0%, rgba(0,4,25,1) 40%, rgba(15,32,57,1) 54%, rgba(15,32,57,1) 100%)',
					boxShadow: 'inset 0px 0px 4px 1px rgba(255,255,255,0.10), 0px 0px 0px 10px rgba(0,0,0,1)',
				}}
				center
			>
				<div className="smooth-rotate expand" style={{ transform: `rotate(${fuel}deg)` }}>
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

			<PositionedElement width="30%" height="30%" top="CALC(50% - 15%)" left="CALC(50% - 15%)" center>
				<div
					className="offroad-weather circular expand centralized"
					style={{
						background: 'linear-gradient(to bottom, rgba(15,32,57,1) 0%, rgba(0,4,25,1) 100%)',
						boxShadow: '0px 10px 40px 10px rgba(0,4,25,1), inset 0px 0px 4px 1px rgba(255,255,255,0.10)',
					}}
				>
					<img src={WeatherIcon} style={{ height: '3rem', filter: 'invert(100%)' }} alt="weather icon" />
					82°
				</div>
			</PositionedElement>

			<PositionedElement width="8rem" top="85vh" left="CALC(50% - 4rem)" center>
				<label className="offroad-speed" style={{ display: 'inline-block' }}>
					{Math.round(location.speed)}
				</label>
				<span> MPH</span>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Offroad;
