/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface ISpeedometer {
	children?: React.ReactElement<any, any> | null;
}

export const Speedometer: React.FC<ISpeedometer> = ({ children }) => {
	return <div>{children}</div>;
};

export default Speedometer;
