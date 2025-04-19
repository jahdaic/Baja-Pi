/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface ILayoutContainer {
	id?: string;
	className?: string;
	children?: React.ReactNode;
}


const LayoutContainer: React.FC<ILayoutContainer> = ({className, children, ...props}) => {


	return ( <div {...props} className={`expand circular ${className || ''}`} style={{overflow: 'hidden'}}>{children}</div> );
}

export default LayoutContainer