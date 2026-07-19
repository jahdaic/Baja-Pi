/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectGps } from '../../../store/gpsSlice';
import { selectWeather } from '../../../store/weatherSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import * as Icon from 'react-bootstrap-icons';

import dayBG from '../../../images/topography-light.jpg';
import nightBG from '../../../images/topography.jpg';

import '../../../css/standard.css';

export interface IDetails {
	children?: React.ReactElement<any, any> | null;
}

export const Details: React.FC<IDetails> = () => {
	const { location, age, stale, satellites } = useAppSelector(selectGps);
	const { weather } = useAppSelector(selectWeather);
	const daylight = weather.icon.includes('d') ? 'day' : 'night';

	return (
		<LayoutContainer id="weather" className={daylight}>
			<PositionedElement
				width="100%"
				height="100%"
				style={{
					backgroundImage: `url(${daylight === 'day' ? dayBG : nightBG})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundColor: daylight === 'day' ? '#8e8e8e' : '#000000',
					opacity: daylight === 'day' ? 1 : 0.5,
					backgroundBlendMode: daylight === 'day' ? 'screen' : 'normal',
				}}
				center
			></PositionedElement>

			<PositionedElement width="100%" top="10vh" left="0" center>
				{/* <label className="">Feels Like</label> */}
				<div className="temperature" style={{ paddingLeft: 'initial' }}>
					{Math.floor(location.speed)}{' '}
				</div>
				<label className="label">
					<b>
						<small>MPH</small>
					</b>
				</label>
				<label className="label">{`${Utility.decimalCoordinateToDegrees(location.latitude, 'lat')},\xa0\xa0${Utility.decimalCoordinateToDegrees(location.longitude, 'long')}`}</label>
			</PositionedElement>

			<PositionedElement width="60vh" top="42vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">
						{/* Speed */}
						<Icon.Speedometer />
					</div>
					<div className="value">
						<b>
							{Math.floor(location.speed)} <small>MPH</small>
						</b>
					</div>
					<div className="value">
						<small>
							<small>±</small> {Math.round(location.error.speed)} <small>mph</small>
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Altitude */}
						<Icon.Triangle />
					</div>
					<div className="value">
						<b>
							{Math.round(location.altitude)} <small>ft</small>
						</b>
					</div>
					<div className="value">
						<small>
							<small>±</small> {Math.round(location.error.altitude)} <small>ft</small>
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Direction */}
						<Icon.Compass />
					</div>
					<div className="value">
						<b>{Utility.degreesToCompassDirection(location.heading)}</b>
					</div>
					<div className="value">
						<small>
							<small>±</small> {location.error.heading}°
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Climb */}
						<Icon.ArrowUpRight />
					</div>
					<div className="value">
						<b>
							{Math.round(location.climb)} <small>ft/s</small>
						</b>
					</div>
					<div className="value">
						<small>
							<small>±</small> {Math.round(location.error.climb)} <small>ft/s</small>
						</small>
					</div>
				</div>
			</PositionedElement>

			<PositionedElement width="60vh" top="62vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">
						{/* Satellites Used */}
						<Icon.Radar />
					</div>
					<div className="value">
						<b>
							{satellites.used}
						</b>
					</div>
					<div className="value">
						<small>
							&nbsp;
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Satellites Tracked */}
						<Icon.Eye />
					</div>
					<div className="value">
						<b>
							{satellites.tracked}
						</b>
					</div>
					<div className="value">
						<small>
							{satellites.seen}
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Signal/Noise Ratio */}
						<Icon.Reception3 />
					</div>
					<div className="value">
						<b>{String((satellites.snr.avg || 0).toFixed(1)).padStart(4, '0')}</b>
					</div>
					<div className="value">
						<small>
							{satellites.snr.max} <small>max</small>
						</small>
					</div>
				</div>
				<div>
					<div className="label">
						{/* Age */}
						<Icon.Clock />
					</div>
					<div className="value">
						<b>
							{age ? Utility.timeSpanToDisplay(new Date(Date.now() - age)) : 'N/A'}
						</b>
					</div>
					<div className="value">
						<small>
							&nbsp;
						</small>
					</div>
				</div>
			</PositionedElement>

			{(stale || location.error.request) && (
				<PositionedElement width="60vh" top="78vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
					{stale ? 'Stale Satellites' : location.error.request}
				</PositionedElement>
			)}
		</LayoutContainer>
	);
};

export default Details;
