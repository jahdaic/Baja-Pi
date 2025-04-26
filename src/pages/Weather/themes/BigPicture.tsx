/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import * as Background from '../../../images/weather-bg';
import * as Icons from 'react-bootstrap-icons';

import '../../../css/big-picture.css';

export interface IBigPicture {
	children?: React.ReactElement<any, any> | null;
}

export const BigPicture: React.FC<IBigPicture> = () => {
	const { weather } = useAppSelector(selectSpeedometer);
	const bg: keyof typeof Background = `bg${'02d' || weather.icon}` as any;

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
				width="50vw"
				top="45vh"
				left="CALC(50% - 25vw - 1rem)"
				className="big-picture-conditions"
				center
			>
				<div>
					<label className="label">
						<Icons.Umbrella />
					</label>
					<div className="value">{weather.rain}%</div>
				</div>
				<div>
					<label className="label">
						<Icons.Wind />
					</label>
					<div className="value">{Math.round(weather.windSpeed)} mph</div>
				</div>
				<div>
					<label className="label">
						<Icons.Droplet />
					</label>
					<div className="value">{weather.humidity}%</div>
				</div>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default BigPicture;
