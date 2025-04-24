/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface IHula {
	children?: React.ReactElement<any, any> | null;
}

export const Hula: React.FC<IHula> = ({ children }) => {
	return <div>{children}</div>;
};

export default Hula;
