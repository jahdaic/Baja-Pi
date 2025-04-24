/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';

import '../../../css/standard.css';
import PositionedElement from '../../../components/layout/PositionedElement';
import WeatherIcon from '../../../components/formatting/WeatherIcon';

export interface IStandard {
	children?: React.ReactElement<any, any> | null;
}

export const Standard: React.FC<IStandard> = () => {
	const { weather } = useAppSelector(selectSpeedometer);

	return (
		<LayoutContainer id="standard">
			<PositionedElement width="100%" top="5vh" left="0" center>
				<label className="">Feels Like</label>
				<div className="temperature">
					<WeatherIcon className="weather-icon" />
					{Math.round(weather.feelsLike)}°
				</div>
				<label className="label">{weather.description}</label>
				<label className="label">{`H:${Math.round(weather.temperatureMax)}° L:${Math.round(weather.temperatureMin)}°`}</label>
			</PositionedElement>
			<PositionedElement width="50%" top="35vh" left="-10%" center>
				<label className="label">Rain</label>
				<div className="value">
					{weather.rain}
					<label className="label">%</label>
				</div>
			</PositionedElement>
			<PositionedElement width="50%" top="35vh" left="60%" center>
				<label className="label">Wind</label>
				<div className="value">
					{Math.round(weather.windSpeed)}
					<label className="label"> mph</label>
				</div>
			</PositionedElement>
			<PositionedElement width="50%" top="55vh" left="-5%" center>
				<label className="label">Humidity</label>
				<div className="value">
					{weather.humidity}
					<label className="label">%</label>
				</div>
			</PositionedElement>
			<PositionedElement width="50%" top="55vh" left="55%" center>
				<label className="label">Pressure</label>
				<div className="value">
					{Utility.millibarsToInchesOfMercury(weather.pressure).toFixed(2)}
					<label className="label">inHg</label>
				</div>
			</PositionedElement>
			<PositionedElement width="50%" top="75vh" left="10%" center>
				<label className="label">Visibility</label>
				<div className="value">
					{weather.visibility}
					<label className="label"> ft</label>
				</div>
			</PositionedElement>
			<PositionedElement width="50%" top="75vh" left="40%" center>
				<label className="label">Sunset</label>
				<div className="value">{Utility.toTimeDisplay(weather.sunset)}</div>
			</PositionedElement>
			Hi
		</LayoutContainer>
	);
};

export default Standard;
