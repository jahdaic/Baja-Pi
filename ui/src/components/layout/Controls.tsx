import config from '../../config';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppDispatch } from '../../store/hooks';
import { setHeadlights, setTurnSignal, setCheckEngine, incrementValue } from '../../store/vehicleSlice';
import * as Speedometer from '../../pages/Speedometer';
import * as Weather from '../../pages/Weather';
import * as GPS from '../../pages/GPS';
import * as Time from '../../pages/Time';
import * as Hula from '../../pages/Hula';
import ErrorBoundary from '../ErrorBoundary';
import ControlMenu from './ControlMenu';

export interface IControls {
	test?: boolean;
}

export const Controls: React.FC<IControls> = ({ test, ...props }) => {
	const dispatch = useAppDispatch();
	const [showCursor, setShowCursor] = useState<boolean>(false);
	const [currentGauge, setCurrentGauge] = useState<number>(0);
	const [currentTheme, setCurrentTheme] = useState<number>(0);
	const [themeIndices, setThemeIndices] = useState<number[]>([0, 0, 0, 0, 0]); // one slot per gauge in appMap
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const timerRef = useRef<any>(null);
	const timeout = 500;

	// Long-press (hold ~700ms without moving) opens the control menu. Tracked
	// here so the follow-up click on a nav zone can be swallowed — otherwise
	// releasing the hold would also change the gauge underneath the menu.
	const LONG_PRESS_MS = 700;
	const pressTimerRef = useRef<any>(null);
	const pressStartRef = useRef<{ x: number; y: number } | null>(null);
	const longPressedRef = useRef<boolean>(false);

	const startPress = (e: React.PointerEvent) => {
		pressStartRef.current = { x: e.clientX, y: e.clientY };
		clearTimeout(pressTimerRef.current);
		pressTimerRef.current = setTimeout(() => {
			longPressedRef.current = true;
			setMenuOpen(true);
		}, LONG_PRESS_MS);
	};

	const movePress = (e: React.PointerEvent) => {
		const start = pressStartRef.current;
		if (!start) return;
		const dx = e.clientX - start.x;
		const dy = e.clientY - start.y;
		if (dx * dx + dy * dy > 100) clearTimeout(pressTimerRef.current); // moved >10px = not a long-press
	};

	const endPress = () => clearTimeout(pressTimerRef.current);

	// Swallow the click that fires right after a long-press so opening the menu
	// doesn't also advance the gauge/theme it was layered over.
	const guard = (fn: () => void) => () => {
		if (longPressedRef.current) {
			longPressedRef.current = false;
			return;
		}
		fn();
	};

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
				Speedometer.VintageVW,
			],
		},
		{
			gauge: Weather.Weather,
			themes: [Weather.Forecast, Weather.Current, Weather.Alerts],
		},
		{
			gauge: GPS.GPS,
			themes: [GPS.Details],
		},
		{
			gauge: Time.Time,
			themes: [Time.Analog, Time.Calendar],
		},
		{
			gauge: Hula.Hula,
			themes: [Hula.Standard, Hula.Stitch, Hula.Shantae],
		},
	];

	const VisibleGauge = appMap[currentGauge].gauge;
	const VisibleTheme = appMap[currentGauge].themes[currentTheme];

	const nextGauge = () => {
		setCurrentGauge(current => {
			const newGauge = current + 1 === appMap.length ? 0 : current + 1;

			setCurrentTheme(themeIndices[newGauge] || 0);

			return newGauge;
		});
	};

	const prevGauge = () => {
		setCurrentGauge(current => {
			const newGauge = current === 0 ? appMap.length - 1 : current - 1;

			setCurrentTheme(themeIndices[newGauge] || 0);

			return newGauge;
		});
	};

	const nextTheme = () => {
		setCurrentTheme(current => {
			const newTheme = current + 1 === appMap[currentGauge].themes.length ? 0 : current + 1;

			setThemeIndices(currentIndices => {
				const newIndices = [...currentIndices];

				newIndices[currentGauge] = newTheme;

				return newIndices;
			});

			return newTheme;
		});
	};

	const prevTheme = () => {
		setCurrentTheme(current => {
			const newTheme = current === 0 ? appMap[currentGauge].themes.length - 1 : current - 1;

			setThemeIndices(currentIndices => {
				const newIndices = [...currentIndices];

				newIndices[currentGauge] = newTheme;

				return newIndices;
			});

			return newTheme;
		});
	};

	const updateSpeedometer = () => {
		if (!test) return;

		// dispatch(setSpeed(speed >= config.speed.limit ? 0 : speed + 1));
		// dispatch(setRPM(rpm >= config.rpm.limit ? 0 : rpm + 1));
		// dispatch(setFuel(fuel >= 100 ? 0 : fuel + 1));
		// dispatch(setOilTemp(oilTemperature >= config.oilPressure.redline ? 0 : oilTemperature + 1));
		// dispatch(setOilPressure(oilPressure >= Number(import.meta.env.VITE_TEMP_REDLINE) ? 0 : oilPressure + 1));
		// dispatch(setVoltage(voltage >= 14 ? 0 : voltage + 0.1));

		dispatch(incrementValue({ name: 'speed', amount: 1, max: config.speed.limit }));
		dispatch(incrementValue({ name: 'rpm', amount: 50, max: config.rpm.limit }));
		dispatch(incrementValue({ name: 'fuel', amount: 1, max: 100 }));
		dispatch(incrementValue({ name: 'oilTemperature', amount: 5, max: config.oilTemp.limit }));
		dispatch(incrementValue({ name: 'oilPressure', amount: 1, max: config.oilPressure.limit }));
		dispatch(incrementValue({ name: 'voltage', amount: 0.1, max: config.voltage.limit }));

		// dispatch(setSpeed(Math.random() * config.speed.limit));
		// dispatch(setRPM(Math.random() * config.rpm.limit));
		// dispatch(setFuel(Math.random() * 100));
		// dispatch(setOilTemp(Math.random() * config.oilTemp.limit));
		// dispatch(setOilPressure(Math.random() * Number(70)));
		// dispatch(setVoltage(Math.random() * config.voltage.limit));
		dispatch(setHeadlights(Math.round(Math.random() * 2)));
		dispatch(setTurnSignal(Boolean(Math.round(Math.random()))));
		dispatch(setCheckEngine(Boolean(Math.round(Math.random()))));

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(updateSpeedometer, timeout);
	};

	useHotkeys('left', prevTheme);
	useHotkeys('right', nextTheme);
	useHotkeys('up', prevGauge);
	useHotkeys('down', nextGauge);
	useHotkeys('c', () => setShowCursor(!showCursor));
	useHotkeys('ctrl+r', () => window.location.reload());
	useHotkeys('m', () => setMenuOpen(true));
	useHotkeys('esc', () => setMenuOpen(false));

	useEffect(() => {
		timerRef.current = setTimeout(updateSpeedometer, 0);

		return () => clearTimeout(timerRef.current);
	}, []);

	return (
		<div
			className={showCursor ? '' : 'hide-cursor'}
			onPointerDown={startPress}
			onPointerMove={movePress}
			onPointerUp={endPress}
			onPointerLeave={endPress}
			onPointerCancel={endPress}
		>
			<ErrorBoundary key={`${currentGauge}-${currentTheme}`}>
				<VisibleGauge>
					<VisibleTheme />
				</VisibleGauge>
			</ErrorBoundary>

			<div className="button-container">
				<div className="prev-button" onClick={guard(prevTheme)} />
				<div className="next-button" onClick={guard(nextTheme)} />
				<div className="bottom-button" onClick={guard(nextGauge)} />
				<div className="top-button" onClick={guard(prevGauge)} />
			</div>

			{menuOpen && <ControlMenu onClose={() => setMenuOpen(false)} />}
		</div>
	);
};

export default Controls;
