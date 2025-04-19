/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface IPositionedElement {
	height?: string | number;
	width?: string | number;
	top?: string | number;
	left?: string | number;
	right?: string | number;
	bottom?: string | number;
	center?: boolean;
	id?: string;
	className?: string;
	children?: React.ReactNode;
}


const PositionedElement: React.FC<IPositionedElement> = ({height, width, top, left, right, bottom, center, className, children, ...props}) => {

	return (
		<div
			{...props}
			className={`${center ? 'centralized' : ''} ${className || ''}`}
			style={{
				position: top || left || right || bottom ? 'absolute' : 'relative',
				top: top,
				left: left,
				right: right,
				bottom: bottom,
				height: height,
				width: width,
			}}
		>
			{children}
		</div>
	);
}

export default PositionedElement