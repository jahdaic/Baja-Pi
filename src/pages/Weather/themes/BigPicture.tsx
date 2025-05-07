/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
// import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import * as Background from '../../../images/weather-bg';
import * as Icons from 'react-bootstrap-icons';

import '../../../css/big-picture.css';
import WeatherIcon from '../../../components/formatting/WeatherIcon';

export interface IBigPicture {
	children?: React.ReactElement<any, any> | null;
}

export const BigPicture: React.FC<IBigPicture> = () => {
	const { weather, forecast } = useAppSelector(selectSpeedometer);
	const bg: keyof typeof Background = `bg${weather.icon}` as any;

	return (
		<LayoutContainer
			id="big-picture"
			style={{ backgroundImage: `url(${Background[bg]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
		>
			<PositionedElement width="100%" top="10vh" left="0" center>
				<label className="">Feels Like</label>
				<div className="temperature" title={bg}>
					{Math.round(weather.feelsLike)}°
				</div>
				<label className="label">{weather.description}</label>
				<label className="label">{`H:${Math.round(weather.temperatureMax)}° L:${Math.round(weather.temperatureMin)}°`}</label>
			</PositionedElement>

			<PositionedElement
				width="50vh"
				top="45vh"
				left="CALC(50% - 25vh - 1rem)"
				className="big-picture-conditions"
				center
			>
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
					<div className="value">{Math.round(weather.windSpeed)} mph</div>
				</div>
				<div>
					<div className="label">
						<Icons.Droplet />
					</div>
					<div className="value">{weather.humidity}%</div>
				</div>
			</PositionedElement>

			<PositionedElement
				width="60vh"
				top="62vh"
				left="CALC(50% - 30vh - 1rem)"
				className="big-picture-conditions"
				center
			>
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
							<div className="value">{Math.round(hour.weather.rain)}%</div>
						</div>
					);
				})}
			</PositionedElement>
		</LayoutContainer>
	);
};

export default BigPicture;
