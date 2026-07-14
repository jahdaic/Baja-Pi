/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface IWeather {
	children?: React.ReactElement<any, any> | null;
}

export const Weather: React.FC<IWeather> = ({ children }) => {
	return <div>{children}</div>;
};

export default Weather;
