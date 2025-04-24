/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import OpenWeatherAPI from 'openweather-api-node';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSpeedometer, setWeather } from '../../store/siteSlice';

export interface IWeather {
	children: React.ReactElement<any, any> | null;
}

const Weather: React.FC<IWeather> = ({ children, ...props }) => {
	const dispatch = useAppDispatch();
	const { location, weather } = useAppSelector(selectSpeedometer);
	const timeout = 900000; // 15 minutes
	const [timeoutID, setTimeoutID] = useState<any>(0);

	const updateWeather = () => {
		// if (process.env.NODE_ENV === 'development') console.log('WEATHER', weather);

		let weatherAPI;

		try {
			weatherAPI = new OpenWeatherAPI({
				key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
				coordinates: {
					lat: location?.latitude || 29.1383,
					lon: location?.longitude || -80.9956,
				},
				units: 'imperial',
			});
		} catch (err) {
			console.error(err);
			return;
		}

		weatherAPI
			.getCurrent()
			.then((data: any) => {
				console.log('WEATHER IN', data);
				dispatch(
					setWeather({
						...weather,
						temperature: data.weather.temp.cur || weather.temperature || 0,
						temperatureMin: data.weather.temp.min || weather.temperatureMin || 0,
						temperatureMax: data.weather.temp.max || weather.temperatureMax || 0,
						feelsLike: data.weather.feelsLike.cur || weather.feelsLike || 0,
						description: data.weather.description || weather.description || '',
						icon: data.weather.icon.raw || weather.icon || '',
						rain: data.weather.rain || weather.rain || 0,
						snow: data.weather.snow || weather.snow || 0,
						windSpeed: data.weather.wind.speed || weather.windSpeed || 0,
						windDirection: data.weather.wind.deg || weather.windDirection || 0,
						humidity: data.weather.humidity || weather.humidity || 0,
						pressure: data.weather.pressure || weather.pressure || 0,
						visibility: data.weather.visibility || weather.visibility || 0,
						sunrise: data.astronomical.sunrise?.toISOString() || weather.sunrise || 0,
						sunset: data.astronomical.sunset?.toISOString() || weather.sunset || 0,
						city: data.name,
						timezone: data.timezoneOffset || weather.timezone || 0,
					}),
				);
				console.log('WEATHER', weather);
			})
			.catch(err => console.error(err))
			.finally(() => setTimeout(updateWeather, timeout));
	};

	useEffect(() => {
		setTimeoutID(setTimeout(updateWeather, 0));

		return () => clearTimeout(timeoutID);
	}, []);

	return children;
};

export default Weather;
