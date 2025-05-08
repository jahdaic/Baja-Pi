/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface ITime {
	children?: React.ReactElement<any, any> | null;
}

export const Time: React.FC<ITime> = ({ children }) => {
	return <div>{children}</div>;
};

export default Time;
