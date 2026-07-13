/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface IGPS {
	children?: React.ReactElement<any, any> | null;
}

export const GPS: React.FC<IGPS> = ({ children }) => {
	return <div>{children}</div>;
};

export default GPS;
