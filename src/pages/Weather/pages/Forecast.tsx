/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import * as Background from '../../../images/weather-bg';
import * as Icons from 'react-bootstrap-icons';
import WeatherIcon from '../../../components/formatting/WeatherIcon';

import '../../../css/weather.css';

export interface IForecast {
	children?: React.ReactElement<any, any> | null;
}

export const Forecast: React.FC<IForecast> = () => {
	const { weather, forecast } = useAppSelector(selectSpeedometer);
	const bg: keyof typeof Background = `bg${weather.icon}` as any;

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
				<label className="label">{Utility.toTitleCase(weather.description)}</label>
				<label className="label">{`H:${Math.round(weather.temperatureMax)}° L:${Math.round(weather.temperatureMin)}°`}</label>
			</PositionedElement>

			<PositionedElement width="60vh" top="45vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">
						<Icons.Thermometer />
					</div>
					<div className="value">{Math.round(weather.temperature)}°</div>
				</div>
				<div>
					<div className="label">
						<Icons.Umbrella />
					</div>
					<div className="value">
						<span>
							{Math.round(weather.rain * 100)}
							<small>%</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">
						<Icons.Wind />
					</div>
					<div className="value">
						<span>
							{Utility.degreesToCompassDirection(weather.windDirection)} {Math.round(weather.windSpeed)}{' '}
							<small>mph</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">
						<Icons.Moisture />
					</div>
					<div className="value">
						<span>
							{weather.humidity}
							<small>%</small>
						</span>
					</div>
				</div>
			</PositionedElement>

			<PositionedElement width="60vh" top="62vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				{forecast.slice(1, 6).map(hour => {
					const date = new Date(hour.dt);

					return (
						<div key={date.getHours()}>
							<label className="label">
								<b>{new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(date)}</b>
							</label>
							<div className="value">
								<WeatherIcon icon={hour.weather.icon.raw} />
							</div>
							<div className="value">{Math.round(hour.weather.feelsLike.cur)}°</div>
							<div className="value">{Math.round(hour.weather.pop * 100)}%</div>
						</div>
					);
				})}
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Forecast;
