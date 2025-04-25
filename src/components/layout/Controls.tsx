/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	setSpeed,
	setRPM,
	setFuel,
	setHeadlights,
	setTurnSignal,
	setCheckEngine,
	setOilTemp,
	setOilPressure,
	setVoltage,
	selectSpeedometer,
} from '../../store/siteSlice';
import * as Speedometer from '../../pages/speedometer';
import * as Weather from '../../pages/Weather';
import * as Hula from '../../pages/Hula';

export function Controls() {
	const dispatch = useAppDispatch();
	const { speed, rpm, fuel, oilTemperature, oilPressure, voltage } = useAppSelector(selectSpeedometer);
	const [currentGauge, setCurrentGauge] = useState<number>(0);
	const [currentTheme, setCurrentTheme] = useState<number>(0);
	const timerRef = useRef<any>(null);
	const timeout = 500;

	const appMap = [
		{
			gauge: Speedometer.Speedometer,
			themes: [
				Speedometer.Standard,
				Speedometer.Offroad,
				Speedometer.Formula1,
				Speedometer.Beetle13,
				Speedometer.LCD,
				Speedometer.Cyberpunk,
				Speedometer.Bajapunk,
			],
		},
		{
			gauge: Weather.Weather,
			themes: [Weather.Standard],
		},
		{
			gauge: Hula.Hula,
			themes: [Hula.Standard, Hula.Stitch, Hula.Shantae],
		},
	];

	const VisibleGauge = appMap[currentGauge].gauge;
	const VisibleTheme = appMap[currentGauge].themes[currentTheme];

	const nextGauge = () => {
		console.log('Next Gauge');
		setCurrentGauge(current => (current + 1 === appMap.length ? 0 : current + 1));
		setCurrentTheme(0);
	};

	const prevGauge = () => {
		console.log('Prev Gauge');
		setCurrentGauge(current => (current === 0 ? appMap.length - 1 : current - 1));
		setCurrentTheme(0);
	};

	const nextTheme = () => {
		console.log('Next Theme');
		setCurrentTheme(current => (current + 1 === appMap[currentGauge].themes.length ? 0 : current + 1));
	};

	const updateSpeedometer = () => {
		// dispatch(setSpeed(speed >= Number(process.env.REACT_APP_SPEED_LIMIT) ? 0 : speed + 1));
		// dispatch(setRPM(rpm >= Number(process.env.REACT_APP_RPM_LIMIT) ? 0 : rpm + 1));
		// dispatch(setFuel(fuel >= 100 ? 0 : fuel + 1));
		// dispatch(setOilTemp(oilTemperature >= Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? 0 : oilTemperature + 1));
		// dispatch(setOilPressure(oilPressure >= Number(process.env.REACT_APP_TEMP_REDLINE) ? 0 : oilPressure + 1));
		// dispatch(setVoltage(voltage >= 14 ? 0 : voltage + 0.1));

		dispatch(setSpeed(Math.random() * Number(process.env.REACT_APP_SPEED_LIMIT)));
		dispatch(setRPM(Math.random() * Number(process.env.REACT_APP_RPM_LIMIT)));
		dispatch(setFuel(Math.random() * 100));
		dispatch(setOilTemp(Math.random() * Number(process.env.REACT_APP_OIL_TEMP_LIMIT)));
		dispatch(setOilPressure(Math.random() * Number(70)));
		dispatch(setVoltage(Math.random() * Number(process.env.REACT_APP_VOLTAGE_LIMIT)));
		dispatch(setHeadlights(Math.round(Math.random() * 2)));
		dispatch(setTurnSignal(Boolean(Math.round(Math.random()))));
		dispatch(setCheckEngine(Boolean(Math.round(Math.random()))));

		timerRef.current = setTimeout(updateSpeedometer, timeout);
	};

	useHotkeys('left', prevGauge);
	useHotkeys('right', nextGauge);
	useHotkeys('down', nextTheme);

	useEffect(() => {
		timerRef.current = setTimeout(updateSpeedometer, 0);

		return () => clearTimeout(timerRef.current);
	}, []);

	return (
		<div>
			<VisibleGauge>
				<VisibleTheme />
			</VisibleGauge>

			<div className="button-container">
				<div className="prev-button" onClick={prevGauge} />
				<div className="next-button" onClick={nextGauge} />
				<div className="bottom-button" onClick={nextTheme} />
				<div className="top-button" onClick={nextGauge} />
			</div>
		</div>
	);
}

export default Controls;
