/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../../../store/siteSlice';
import * as Utility from '../../../scripts/Utility';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import BG from '../../../images/topography.jpg';

import '../../../css/standard.css';

export interface IDetails {
	children?: React.ReactElement<any, any> | null;
}

export const Details: React.FC<IDetails> = () => {
	const { location } = useAppSelector(selectSpeedometer);
	//external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F205%2F180%2Foriginal%2Fvector-black-topographic-map-lines-background.jpg&f=1&nofb=1&ipt=b0bc6772a073aae207aa74583c0c97b2642af4d2f75898607807cdb4459ca07f
	return (
		<LayoutContainer
			id="weather"
			className={'night'}
			style={{ backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
		>
			<PositionedElement width="100%" top="10vh" left="0" center>
				{/* <label className="">Feels Like</label> */}
				<div className="temperature" style={{ paddingLeft: 'initial' }}>
					{Math.round(location.speed)}{' '}
				</div>
				<label className="label">MPH</label>
				<label className="label">{`${location.latitude}° ${location.longitude}°`}</label>
			</PositionedElement>

			<PositionedElement width="60vh" top="45vh" left="CALC(50% - 30vh - 1rem)" className="weather-panel" center>
				<div>
					<div className="label">Speed</div>
					<div className="value">
						<span>
							{Math.round(location.speed)} <small>MPH</small>
						</span>
					</div>
				</div>

				<div>
					<div className="label">Altitude</div>
					<div className="value">
						{Math.round(location.altitude)} <small>ft</small>
					</div>
				</div>
				<div>
					<div className="label">Direction</div>
					<div className="value">
						<span>
							{Utility.degreesToCompassDirection(location.heading)}
							{/* <small>%</small> */}
						</span>
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
						{Math.round(location.error.speed)} <small>mph</small>
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
						{Math.round(location.error.climb)} <small>ft/s</small>
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
