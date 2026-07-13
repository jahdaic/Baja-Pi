/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import OpenWeatherAPI, { Everything } from 'openweather-api-node';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSpeedometer, setForecast, setWeather } from '../../store/siteSlice';
import * as Utility from '../../scripts/Utility';

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

		let weatherAPI: OpenWeatherAPI;

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
			.getEverything()
			.then((data: Everything) => {
				console.log('CURRENT WEATHER IN', data);

				dispatch(
					setWeather({
						...weather,
						temperature: data.current.weather.temp.cur || weather.temperature || 0,
						temperatureMin: data.daily[0].weather.temp.min || weather.temperatureMin || 0,
						temperatureMax: data.daily[0].weather.temp.max || weather.temperatureMax || 0,
						feelsLike: data.current.weather.feelsLike.cur || weather.feelsLike || 0,
						description: data.current.weather.description || weather.description || '',
						icon: data.current.weather.icon.raw || weather.icon || '',
						rain: data.hourly[0].weather.pop || weather.rain || 0,
						snow: data.current.weather.snow || weather.snow || 0,
						windSpeed: data.current.weather.wind.speed || weather.windSpeed || 0,
						windDirection: data.current.weather.wind.deg || weather.windDirection || 0,
						humidity: data.current.weather.humidity || weather.humidity || 0,
						pressure: data.current.weather.pressure || weather.pressure || 0,
						visibility: Utility.metersToFeet(data.current.weather.visibility) || weather.visibility || 0,
						uvi: data.current.weather.uvi || weather.uvi || 0,
						sunrise: data.current.astronomical.sunrise?.toISOString() || weather.sunrise || '',
						sunset: data.current.astronomical.sunset?.toISOString() || weather.sunset || '',
						city: '',
						timezone: data.timezoneOffset || weather.timezone || 0,
						alerts: data.alerts || [],
					}),
				);

				dispatch(setForecast(data.hourly.slice(0, 10).map(f => ({ ...f, dt: f.dt.toISOString() as any }))));

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
