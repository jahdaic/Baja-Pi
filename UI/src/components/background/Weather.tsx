import React from 'react';

export interface IWeather {
	children: React.ReactElement<any, any> | null;
}

/**
 * Weather background wrapper.
 *
 * TODO(weather): the live weather data layer was removed during the Vite
 * migration. It previously used `openweather-api-node` (which required Node
 * polyfills in the browser). Re-implement using the keyless NWS API
 * (https://api.weather.gov) and dispatch setWeather/setForecast here.
 * Until then this is a passthrough that renders its children only.
 */
const Weather: React.FC<IWeather> = ({ children }) => {
	return children;
};

export default Weather;
