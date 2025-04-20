import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import LinearGauge from '../../../components/gauges/LinearGauge';

export const Bajapunk = () => {
	const { speed, rpm, fuel, oilTemperature, oilPressure, voltage, headlights, turnSignal, checkEngine } =
		useAppSelector(selectSpeedometer);
	const fontFace = 'Bebas Neue';
	const textColor = '#FFFFFF';
	const barColor = '#FFFFFF';
	const barFillColor = '#FFFFFF';
	const highlightColor = '#e62c0f';

	return (
		<div id="baja" className="expand circular">
			<div
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
					backdropFilter: 'blur(0px)',
				}}
			/>

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
						} /*{from: 5, to: 7, color: 'currentcolor'}*/,
					]}
					highlightsWidth={14}
					numbersMargin={0}
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
					height: '35vh',
					width: '20vh',
					position: 'absolute',
					top: '28vh',
					left: '5vh',
				}}
			>
				<LinearGauge
					units="PSI"
					needle={false}
					value={oilPressure}
					minValue={0}
					maxValue={70}
					majorTicks={[0, 10, 20, 30, 40, 50, 60, 70]}
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
					colorBarStroke="red"
					colorBar="transparent"
					colorBarProgress={barFillColor}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={32}
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
					needle={false}
					value={8}
					minValue={0}
					maxValue={15}
					majorTicks={[0, 5, 10, 15]}
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
					fontNumbersSize={32}
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
					needle={false}
					value={voltage}
					minValue={0}
					maxValue={Number(process.env.REACT_APP_VOLTAGE_LIMIT)}
					majorTicks={[0, 2, 4, 6, 8, 10, 12, 14]}
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
					colorBarProgress={barFillColor}
					colorUnits={barColor}
					fontNumbers={fontFace}
					fontNumbersSize={32}
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
					units="°F"
					needle={false}
					value={50}
					minValue={0}
					maxValue={120}
					majorTicks={[0, 20, 40, 60, 80, 100, 120]}
					minorTicks={2}
					tickSide="right"
					numberSide="right"
					ticksWidth={5}
					ticksWidthMinor={3}
					highlights={[{ from: 80, to: 120, color: highlightColor }]}
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
					fontNumbersSize={32}
					fontUnits={fontFace}
					borders={false}
					animation={true}
				/>
			</div>

			<div
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
			</div>

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
		</div>
	);
};

export default Bajapunk;
