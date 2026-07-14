/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSpeedometer, setForecast, setWeather } from '../../store/siteSlice';
import { fetchWeather } from '../../scripts/weather';

export interface IWeather {
	children: React.ReactElement<any, any> | null;
}

const REFRESH_MS = 900000; // 15 minutes

// Fallback location (New Smyrna Beach, FL) used until GPS provides a fix.
const DEFAULT_LAT = 29.1383;
const DEFAULT_LON = -80.9956;

/**
 * Background wrapper that keeps weather state fresh. On a 15-minute cycle it
 * pulls the current location's weather (NWS + Open-Meteo + local sun times) and
 * dispatches it into the store. Refs keep the interval reading the latest GPS
 * position and previous weather without re-subscribing on every render.
 */
const Weather: React.FC<IWeather> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { location, weather } = useAppSelector(selectSpeedometer);

	const locationRef = useRef(location);
	locationRef.current = location;
	const weatherRef = useRef(weather);
	weatherRef.current = weather;
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const updateWeather = async () => {
		const lat = locationRef.current?.latitude || DEFAULT_LAT;
		const lon = locationRef.current?.longitude || DEFAULT_LON;

		try {
			const { weather: next, forecast } = await fetchWeather(lat, lon, weatherRef.current);
			dispatch(setWeather(next));
			dispatch(setForecast(forecast));
		} catch (err) {
			console.error('weather update failed', err);
		} finally {
			timeoutRef.current = setTimeout(updateWeather, REFRESH_MS);
		}
	};

	useEffect(() => {
		updateWeather();
		return () => clearTimeout(timeoutRef.current);
	}, []);

	return children;
};

export default Weather;
