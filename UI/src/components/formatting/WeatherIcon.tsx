/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectSpeedometer } from '../../store/siteSlice';
import * as Icon from 'react-bootstrap-icons';

export interface IWeatherIcon {
	icon?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement<any, any> | null;
}

const WeatherIcon: React.FC<IWeatherIcon> = ({ icon, className, style, children, ...props }) => {
	const { weather } = useAppSelector(selectSpeedometer);

	const getWeatherIcon = (code: string) => {
		switch (code) {
			case '01d':
				return <Icon.Sun className={className} style={style} />;
			case '01n':
				return <Icon.MoonStars className={className} style={style} />;
			case '02d':
				return <Icon.CloudSun className={className} style={style} />;
			case '02n':
				return <Icon.CloudMoon className={className} style={style} />;
			case '03d':
			case '03n':
				return <Icon.Cloud className={className} style={style} />;
			case '04d':
			case '04n':
				return <Icon.Clouds className={className} style={style} />;
			case '09d':
			case '09n':
				return <Icon.CloudDrizzle className={className} style={style} />;
			case '10d':
			case '10n':
				return <Icon.CloudRainHeavy className={className} style={style} />;
			case '11d':
			case '11n':
				return <Icon.CloudLightningRain className={className} style={style} />;
			case '13d':
			case '13n':
				return <Icon.Snow2 className={className} style={style} />;
			case '50d':
			case '50n':
				return <Icon.CloudHaze2 className={className} style={style} />;
			default:
				return <Icon.QuestionLg className={className} style={style} />;
		}
	};

	return getWeatherIcon(icon || weather.icon);
};

export default WeatherIcon;
