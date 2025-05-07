/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
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
	const WindDirection = useMemo(() => Utility.degreesToArrowIcon(weather.windDirection), [weather.windDirection]);

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

			<PositionedElement width="50vh" top="50vh" left="CALC(50% - 25vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">
						<Icons.Umbrella />
					</div>
					<div className="value">{weather.rain}%</div>
				</div>
				<div>
					<div className="label">
						<Icons.Wind />
					</div>
					<div className="value">
						<WindDirection /> {Math.round(weather.windSpeed)} mph
					</div>
				</div>
				<div>
					<div className="label">
						<Icons.Moisture />
					</div>
					<div className="value">{weather.humidity}%</div>
				</div>
			</PositionedElement>

			<PositionedElement width="50vh" top="70vh" left="CALC(50% - 25vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">
						<Icons.Speedometer />
					</div>
					<div className="value">{Utility.millibarsToInchesOfMercury(weather.pressure).toFixed(2)} inHg</div>
				</div>
				<div>
					<div className="label">
						<Icons.Binoculars />
					</div>
					<div className="value">{weather.visibility} ft</div>
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
