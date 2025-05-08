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

import '../../../css/standard.css';

export interface ICurrent {
	children?: React.ReactElement<any, any> | null;
}

export const Current: React.FC<ICurrent> = () => {
	const { weather } = useAppSelector(selectSpeedometer);
	const bg: keyof typeof Background = `bg${weather.icon}` as any;
	// const WindDirection = useMemo(() => Utility.degreesToArrowIcon(weather.windDirection), [weather.windDirection]);

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
							{weather.rain}
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
				<div>
					<div className="label">
						<Icons.Sun />
					</div>
					<div className="value">{weather.uvi}</div>
				</div>
				<div>
					<div className="label">
						<Icons.Speedometer />
					</div>
					<div className="value">
						<span>
							{Utility.millibarsToInchesOfMercury(weather.pressure).toFixed(2)} <small>inHg</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">
						<Icons.Binoculars />
					</div>
					<div className="value">
						<span>
							{weather.visibility} <small>ft</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">
						<Icons.SunsetFill />
					</div>
					<div className="value">{Utility.toTimeDisplay(weather.sunset)}</div>
				</div>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Current;
