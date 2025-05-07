/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch } from '../../store/hooks';
import { setHeadlights, setTurnSignal, setCheckEngine, incrementValue } from '../../store/siteSlice';
import * as Speedometer from '../../pages/speedometer';
import * as Weather from '../../pages/Weather';
import * as Hula from '../../pages/Hula';

export function Controls() {
	const dispatch = useAppDispatch();
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
			themes: [Weather.Standard, Weather.BigPicture],
		},
		{
			gauge: Hula.Hula,
			themes: [Hula.Standard, Hula.Stitch, Hula.Shantae],
		},
	];

	const VisibleGauge = appMap[currentGauge].gauge;
	const VisibleTheme = appMap[currentGauge].themes[currentTheme];

	const nextGauge = () => {
		setCurrentGauge(current => (current + 1 === appMap.length ? 0 : current + 1));
		setCurrentTheme(0);
	};

	const prevGauge = () => {
		setCurrentGauge(current => (current === 0 ? appMap.length - 1 : current - 1));
		setCurrentTheme(0);
	};

	const nextTheme = () => {
		setCurrentTheme(current => (current + 1 === appMap[currentGauge].themes.length ? 0 : current + 1));
	};

	const prevTheme = () => {
		setCurrentTheme(current => (current === 0 ? appMap[currentGauge].themes.length - 1 : current - 1));
	};

	const updateSpeedometer = () => {
		// dispatch(setSpeed(speed >= Number(process.env.REACT_APP_SPEED_LIMIT) ? 0 : speed + 1));
		// dispatch(setRPM(rpm >= Number(process.env.REACT_APP_RPM_LIMIT) ? 0 : rpm + 1));
		// dispatch(setFuel(fuel >= 100 ? 0 : fuel + 1));
		// dispatch(setOilTemp(oilTemperature >= Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? 0 : oilTemperature + 1));
		// dispatch(setOilPressure(oilPressure >= Number(process.env.REACT_APP_TEMP_REDLINE) ? 0 : oilPressure + 1));
		// dispatch(setVoltage(voltage >= 14 ? 0 : voltage + 0.1));

		dispatch(incrementValue({ name: 'speed', amount: 1, max: Number(process.env.REACT_APP_SPEED_LIMIT) }));
		dispatch(incrementValue({ name: 'rpm', amount: 50, max: Number(process.env.REACT_APP_RPM_LIMIT) }));
		dispatch(incrementValue({ name: 'fuel', amount: 1, max: 100 }));
		dispatch(incrementValue({ name: 'oilTemperature', amount: 5, max: Number(process.env.REACT_APP_OIL_TEMP_LIMIT) }));
		dispatch(incrementValue({ name: 'oilPressure', amount: 1, max: Number(process.env.REACT_APP_OIL_PRESSURE_LIMIT) }));
		dispatch(incrementValue({ name: 'voltage', amount: 0.1, max: Number(process.env.REACT_APP_VOLTAGE_LIMIT) }));

		// dispatch(setSpeed(Math.random() * Number(process.env.REACT_APP_SPEED_LIMIT)));
		// dispatch(setRPM(Math.random() * Number(process.env.REACT_APP_RPM_LIMIT)));
		// dispatch(setFuel(Math.random() * 100));
		// dispatch(setOilTemp(Math.random() * Number(process.env.REACT_APP_OIL_TEMP_LIMIT)));
		// dispatch(setOilPressure(Math.random() * Number(70)));
		// dispatch(setVoltage(Math.random() * Number(process.env.REACT_APP_VOLTAGE_LIMIT)));
		dispatch(setHeadlights(Math.round(Math.random() * 2)));
		dispatch(setTurnSignal(Boolean(Math.round(Math.random()))));
		dispatch(setCheckEngine(Boolean(Math.round(Math.random()))));

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(updateSpeedometer, timeout);
	};

	console.log('CURRENT', currentGauge, currentTheme);

	useHotkeys('left', prevTheme);
	useHotkeys('right', nextTheme);
	useHotkeys('up', prevGauge);
	useHotkeys('down', nextGauge);

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
				<div className="prev-button" onClick={prevTheme} />
				<div className="next-button" onClick={nextTheme} />
				<div className="bottom-button" onClick={nextGauge} />
				<div className="top-button" onClick={prevGauge} />
			</div>
		</div>
	);
}

export default Controls;
