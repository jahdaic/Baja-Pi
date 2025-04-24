import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import PositionedElement from '../../../components/layout/PositionedElement';
import LayoutContainer from '../../../components/layout/LayoutContainer';

import '../../../css/standard.css';

export const Standard = () => {
	const { speed, rpm, turnSignal, checkEngine } = useAppSelector(selectSpeedometer);
	const fontFace = 'Bebas Neue';
	const textColor = '#FFFFFF';
	const tickColor = '#FFFFFF';
	const needleColor = '#FFFFFF';
	const highlightColor = '#e62c0f';

	return (
		<LayoutContainer id="standard">
			<PositionedElement width="100%" height="100%" center>
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
					minorTicks={2}
					strokeTicks={true}
					ticksAngle={180}
					startAngle={45}
					numbersMargin={5}
					highlights={[
						{ from: 14.5, to: 15.5, color: highlightColor },
						{ from: 31, to: 32, color: highlightColor },
						{ from: 47, to: 48, color: highlightColor },
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
					colorNeedleCircleInner="#171717"
					colorNeedleCircleInnerEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={28}
					needleShadow={false}
					needleStart={0}
					needleEnd={93}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					needleCircleInner={true}
					barStrokeWidth={0}
					barWidth={0}
					barProgress={false}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement width="100%" height="100%" center className="gauge-glow">
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
					minorTicks={2}
					strokeTicks={true}
					ticksAngle={180}
					startAngle={45}
					numbersMargin={5}
					highlights={[]}
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
					colorNeedleCircleInner="#171717"
					colorNeedleCircleInnerEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={28}
					needleShadow={false}
					needleStart={0}
					needleEnd={93}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					needleCircleInner={true}
					barStrokeWidth={0}
					barWidth={0}
					barProgress={false}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement top="35%" left="65%" height="40vh" width="40vh">
				<RadialGauge
					value={rpm / 1000}
					units="× 1000"
					fontUnits={fontFace}
					title="RPM"
					fontTitle={fontFace}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_RPM_LIMIT || 7000) / 1000}
					majorTicks={[0, 1, 2, 3, 4, 5, 6, 7]}
					minorTicks={2}
					strokeTicks={true}
					ticksAngle={180}
					startAngle={0}
					numbersMargin={5}
					highlights={[
						{
							from: Number(process.env.REACT_APP_RPM_REDLINE || 5000) / 1000,
							to: Number(process.env.REACT_APP_RPM_LIMIT || 7000) / 1000,
							color: highlightColor,
						},
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
					colorNeedleCircleInner="#171717"
					colorNeedleCircleInnerEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={38}
					needleShadow={false}
					needleStart={0}
					needleEnd={93}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					needleCircleInner={true}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<PositionedElement top="35%" left="65%" height="40vh" width="40vh" className="gauge-glow">
				<RadialGauge
					value={rpm / 1000}
					units="× 1000"
					fontUnits={fontFace}
					title="RPM"
					fontTitle={fontFace}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_RPM_LIMIT || 7000) / 1000}
					majorTicks={[0, 1, 2, 3, 4, 5, 6, 7]}
					minorTicks={2}
					strokeTicks={true}
					ticksAngle={180}
					startAngle={0}
					numbersMargin={5}
					highlights={[]}
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
					colorNeedleCircleInner="#171717"
					colorNeedleCircleInnerEnd="#000000"
					fontNumbers={fontFace}
					fontNumbersSize={38}
					needleShadow={false}
					needleStart={0}
					needleEnd={93}
					needleType="arrow"
					needleCircleSize={14}
					needleCircleOuter={false}
					needleCircleInner={true}
					borders={false}
					borderOuterWidth={0}
					borderMiddleWidth={0}
					borderInnerWidth={0}
				/>
			</PositionedElement>

			<div
				className="centralized"
				style={{ width: '6rem', position: 'absolute', top: '20vh', left: 'CALC(50% - 3rem)' }}
			>
				<div className={`standard-turn ${turnSignal ? 'standard-turn-on' : ''}`}>⬌</div>
			</div>

			<div
				className="centralized glow"
				style={{ width: '6rem', position: 'absolute', top: '68vh', left: 'CALC(50% - 3rem)' }}
			>
				<label className="standard-speed">{Math.round(speed)}</label>
			</div>

			<div
				className="centralized glow"
				style={{ width: '6rem', position: 'absolute', top: '78vh', left: 'CALC(50% - 3rem)' }}
			>
				<label className="baja-check-engine">{checkEngine ? '⚠' : ''}</label>
			</div>
		</LayoutContainer>
	);
};

export default Standard;
