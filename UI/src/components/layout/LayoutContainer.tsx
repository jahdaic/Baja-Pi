/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface ILayoutContainer {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

const LayoutContainer: React.FC<ILayoutContainer> = ({ className, style, children, ...props }) => {
	return (
		<div
			{...props}
			className={`expand circular ${className || ''}`}
			style={{ position: 'absolute', overflow: 'hidden', ...style }}
		>
			{children}
		</div>
	);
};

export default LayoutContainer;
