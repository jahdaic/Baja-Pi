/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import * as Background from '../../../images/weather-bg';
import WeatherIcon from '../../../components/formatting/WeatherIcon';

import '../../../css/weather.css';

export interface IAlerts {
	children?: React.ReactElement<any, any> | null;
}

export const Alerts: React.FC<IAlerts> = () => {
	const { weather } = useAppSelector(selectSpeedometer);
	const bg: keyof typeof Background = `bg${weather.icon}` as any;
	const [alertIndex, setAlertIndex] = useState<number>(0);
	const timerRef = useRef<any>(null);
	const timeout = 5000;

	const nextAlert = () => {
		setAlertIndex(currentIndex => (currentIndex >= weather.alerts.length - 1 ? 0 : currentIndex + 1));
		setTimeout(nextAlert, timeout);
	};

	useEffect(() => {
		timerRef.current = setTimeout(nextAlert, timeout);

		return () => clearTimeout(timerRef.current);
	}, []);

	return (
		<LayoutContainer
			id="weather"
			className={bg.includes('d') ? 'day' : 'night'}
			style={{ backgroundImage: `url(${Background[bg]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
		>
			<PositionedElement width="100%" top="10vh" left="0" center>
				<label className="">Feels Like</label>
				<div className="temperature">
					<WeatherIcon className="weather-icon" />
					{Math.round(weather.feelsLike)}°
				</div>
			</PositionedElement>

			<PositionedElement width="60vh" top="33vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div className="value">
					<div style={{ height: '45vh', overflow: 'hidden' }}>
						{weather.alerts.length ? (
							<>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<b>{weather.alerts[alertIndex]?.event.toUpperCase()}</b>
									<span style={{ display: 'inline-block', marginLeft: 15, marginRight: 15 }}> • </span>
									<i>
										{alertIndex + 1} of {weather.alerts.length}
									</i>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
									<small>
										<i>
											{Utility.toTimeDisplay(weather.alerts[alertIndex].start * 1000)}-
											{Utility.toTimeDisplay(weather.alerts[alertIndex].end * 1000)}
										</i>
									</small>
								</div>
								{/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
									<small>
										<i>
											{alertIndex + 1} of {weather.alerts.length}
										</i>
									</small>
								</div> */}
								{weather.alerts[alertIndex].description}
							</>
						) : (
							'No Alerts'
						)}
					</div>
				</div>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Alerts;
