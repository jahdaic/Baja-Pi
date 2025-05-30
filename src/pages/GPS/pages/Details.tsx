/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import dayBG from '../../../images/topography-light.jpg';
import nightBG from '../../../images/topography.jpg';

import '../../../css/standard.css';

export interface IDetails {
	children?: React.ReactElement<any, any> | null;
}

export const Details: React.FC<IDetails> = () => {
	const { location, weather } = useAppSelector(selectSpeedometer);
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
				<label className="label">MPH</label>
				<label className="label">{`${location.latitude}° ${location.longitude}°`}</label>
			</PositionedElement>

			<PositionedElement width="60vh" top="45vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">Speed</div>
					<div className="value">
						<span>
							{Math.floor(location.speed)} <small>MPH</small>
						</span>
					</div>
				</div>

				<div>
					<div className="label">Altitude</div>
					<div className="value">
						<span>
							{Math.round(location.altitude)} <small>ft</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">Direction</div>
					<div className="value">
						<span>{Utility.degreesToCompassDirection(location.heading)}</span>
					</div>
				</div>
				<div>
					<div className="label">Climb</div>
					<div className="value">
						<span>
							{Math.round(location.climb)} <small>ft/s</small>
						</span>
					</div>
				</div>
			</PositionedElement>

			<PositionedElement width="60vh" top="62vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">Speed Err</div>
					<div className="value">
						<span>
							{Math.round(location.error.speed)} <small>mph</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">Alt. Err</div>
					<div className="value">
						<span>
							{Math.round(location.error.altitude)} <small>ft</small>
						</span>
					</div>
				</div>
				<div>
					<div className="label">Dir. Err</div>
					<div className="value">
						<span>{location.error.heading}°</span>
					</div>
				</div>
				<div>
					<div className="label">Climb Err</div>
					<div className="value">
						<span>
							{Math.round(location.error.climb)} <small>ft/s</small>
						</span>
					</div>
				</div>
			</PositionedElement>

			{location.error.request && (
				<PositionedElement width="60vh" top="78vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
					{location.error.request}
				</PositionedElement>
			)}
		</LayoutContainer>
	);
};

export default Details;
