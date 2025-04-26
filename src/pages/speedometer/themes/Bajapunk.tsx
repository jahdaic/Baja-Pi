import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import RadialGauge from '../../../components/gauges/RadialGauge';
import LinearGauge from '../../../components/gauges/LinearGauge';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import '../../../css/bajapunk.css';

export const Bajapunk = () => {
	const { speed, rpm, fuel, oilTemperature, oilPressure, voltage, headlights, turnSignal, checkEngine } =
		useAppSelector(selectSpeedometer);
	const fontFace = 'Bebas Neue';
	const textColor = '#FFFFFF';
	const barColor = '#FFFFFF';
	const barFillColor = '#FFFFFF';
	const highlightColor = '#e62c0f';

	const gaugeNumberSize = 40;
	const gaugeLabelSize = 28;

	return (
		<LayoutContainer id="baja">
			<div
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<RadialGauge
					needle={false}
					value={rpm / 1000}
					height={window.innerHeight}
					width={window.innerHeight}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_RPM_LIMIT) / 1000}
					majorTicks={Array.from(Array(Number(process.env.REACT_APP_RPM_LIMIT) / 1000 + 1).keys())}
					minorTicks={5}
					exactTicks={false}
					strokeTicks={true}
					ticksAngle={100}
					startAngle={130}
					highlights={[
						{
							from: 0,
							to: rpm / 1000,
							color: barColor,
						} /*{from: 5, to: 7, color: 'currentcolor'}*/,
					]}
					highlightsWidth={14}
					numbersMargin={3}
					barProgress={false}
					fontNumbersSize={12}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					fontNumbers={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<RadialGauge
					needle={false}
					value={oilTemperature}
					height={window.innerHeight}
					width={window.innerHeight}
					minValue={120}
					maxValue={Number(process.env.REACT_APP_OIL_TEMP_LIMIT || 300)}
					majorTicks={[120, 180, 220, 260, 300]}
					minorTicks={2}
					exactTicks={false}
					strokeTicks={true}
					ticksAngle={45}
					startAngle={20}
					highlights={[
						{
							from: 120,
							to: Math.max(oilTemperature, 120),
							color: barColor,
						},
					]}
					highlightsWidth={14}
					numbersMargin={0}
					barProgress={false}
					fontNumbersSize={14}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					fontNumbers={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<RadialGauge
					needle={false}
					value={fuel}
					height={window.innerHeight}
					width={window.innerHeight}
					minValue={0}
					maxValue={100}
					majorTicks={['F', '', '', '', '', '', '', 'E']}
					minorTicks={2}
					exactTicks={false}
					strokeTicks={true}
					ticksAngle={45}
					startAngle={295}
					highlights={[
						{
							from: 100 - fuel,
							to: 100,
							color: fuel > 20 ? barColor : highlightColor,
						},
					]}
					highlightsWidth={14}
					numbersMargin={3}
					barProgress={false}
					fontNumbersSize={14}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					fontNumbers={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '35vh',
					width: '20vh',
					position: 'absolute',
					top: '28vh',
					left: '5vh',
				}}
			>
				<LinearGauge
					units="PSI"
					fontUnitsSize={gaugeLabelSize}
					needle={false}
					value={oilPressure}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_OIL_PRESSURE_LIMIT) || 70}
					majorTicks={Utility.getIntervalValues(0, Number(process.env.REACT_APP_OIL_PRESSURE_LIMIT || 70), 8)}
					minorTicks={2}
					tickSide="left"
					numberSide="left"
					ticksWidth={5}
					ticksWidthMinor={3}
					highlights={[
						{
							from: 0,
							to: Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE),
							color: highlightColor,
						},
					]}
					highlightsWidth={3}
					barBeginCircle={0}
					barWidth={window.innerHeight / 33}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					colorBarStroke="green"
					colorBar="transparent"
					colorBarProgress={
						oilPressure > Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? barFillColor : highlightColor
					}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={gaugeNumberSize}
					fontUnits={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '35vh',
					width: '20vh',
					position: 'absolute',
					top: '28vh',
					left: '20vh',
				}}
			>
				<LinearGauge
					units="BOOST"
					fontUnitsSize={gaugeLabelSize}
					needle={false}
					value={8}
					minValue={0}
					maxValue={15}
					majorTicks={Utility.getIntervalValues(0, 15, 6)}
					minorTicks={2}
					tickSide="left"
					numberSide="left"
					ticksWidth={5}
					ticksWidthMinor={3}
					highlights={[{ from: 12.5, to: 15, color: highlightColor }]}
					highlightsWidth={3}
					barBeginCircle={0}
					barWidth={window.innerHeight / 33}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					colorBarStroke="red"
					colorBar="transparent"
					colorBarProgress={barFillColor}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={gaugeNumberSize}
					fontUnits={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '35vh',
					width: '20vh',
					position: 'absolute',
					top: '28vh',
					right: '20vh',
				}}
			>
				<LinearGauge
					units="VOLTS"
					fontUnitsSize={gaugeLabelSize}
					needle={false}
					value={voltage}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_VOLTAGE_LIMIT)}
					majorTicks={Utility.getIntervalValues(0, Number(process.env.REACT_APP_VOLTAGE_LIMIT), 8)}
					minorTicks={2}
					tickSide="right"
					numberSide="right"
					ticksWidth={5}
					ticksWidthMinor={3}
					highlights={[
						{
							from: 0,
							to: Number(process.env.REACT_APP_VOLTAGE_REDLINE),
							color: highlightColor,
						},
					]}
					highlightsWidth={3}
					barBeginCircle={0}
					barWidth={window.innerHeight / 33}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					colorBarStroke="red"
					colorBar="transparent"
					colorBarProgress={voltage > Number(process.env.REACT_APP_VOLTAGE_REDLINE) ? barFillColor : highlightColor}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={gaugeNumberSize}
					fontUnits={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
				style={{
					height: '35vh',
					width: '20vh',
					position: 'absolute',
					top: '28vh',
					right: '5vh',
				}}
			>
				<LinearGauge
					units="Oil °F"
					fontUnitsSize={gaugeLabelSize}
					needle={false}
					value={oilTemperature}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_OIL_TEMP_LIMIT)}
					majorTicks={Utility.getIntervalValues(0, Number(process.env.REACT_APP_OIL_TEMP_LIMIT), 7)}
					minorTicks={2}
					tickSide="right"
					numberSide="right"
					ticksWidth={5}
					ticksWidthMinor={3}
					highlights={[
						{
							from: Number(process.env.REACT_APP_OIL_TEMP_REDLINE),
							to: Number(process.env.REACT_APP_OIL_TEMP_LIMIT),
							color: highlightColor,
						},
					]}
					highlightsWidth={3}
					barBeginCircle={0}
					barWidth={window.innerHeight / 33}
					colorPlate="transparent"
					colorNumbers={textColor}
					colorMinorTicks={textColor}
					colorMajorTicks={textColor}
					colorBarStroke="red"
					colorBar="transparent"
					colorBarProgress={
						oilTemperature < Number(process.env.REACT_APP_OIL_TEMP_REDLINE) ? barFillColor : highlightColor
					}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={gaugeNumberSize}
					fontUnits={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			{/* <div
				className="centralized"
				style={{
					width: '6rem',
					position: 'absolute',
					top: '18vh',
					left: 'CALC(50% - 3rem)',
				}}
			>
				<label className="baja-label">RPM</label>
				<div className="baja-value">{rpm.toFixed(0)}</div>
			</div>

			<div
				className="centralized"
				style={{
					width: '13rem',
					position: 'absolute',
					top: 'CALC(50% - 5rem)',
					left: 'CALC(50% - 6.5rem)',
				}}
			>
				<div className="baja-speed lcd-value">
					<b>{speed.toFixed(0)}</b>
				</div>
				<label className="baja-label">MPH</label>
			</div> */}

			<PositionedElement width="8rem" top="18vh" left="CALC(50% - 4rem)" center>
				<label className="baja-label">RPM</label>
				<div className="baja-rpm">{rpm.toFixed(0)}</div>
			</PositionedElement>

			<PositionedElement width="13rem" height="10rem" top="CALC(50% - 5rem)" left="CALC(50% - 6.5rem)" center>
				<div className="baja-speed">{speed.toFixed(0)}</div>
				<label className="baja-label">MPH</label>
			</PositionedElement>

			<div
				className="centralized"
				style={{
					width: '6rem',
					position: 'absolute',
					top: '56vh',
					left: 'CALC(50% - 3rem)',
				}}
			>
				<div className="baja-turn">{turnSignal ? '⬌' : ''}</div>
			</div>

			<div
				className="centralized"
				style={{
					width: '6rem',
					position: 'absolute',
					top: '78vh',
					left: 'CALC(50% - 3rem)',
				}}
			>
				<label className="baja-check-engine">{checkEngine ? '⚠' : ''}</label>
			</div>

			<div
				className="centralized"
				style={{
					width: '6rem',
					position: 'absolute',
					top: '70vh',
					left: '55vh',
				}}
			>
				<label className="baja-symbol">{headlights === 1 ? '◀=' : ''}</label>
				<label className="baja-symbol">{headlights === 2 ? '◀Ⲷ' : ''}</label>
			</div>
		</LayoutContainer>
	);
};

export default Bajapunk;
