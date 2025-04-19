/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export interface IPanel {
	height?: string | number;
	width?: string | number;
	top?: string | number;
	left?: string | number;
	right?: string | number;
	bottom?: string | number;
	background?: string;
	borderWidth?: string | number;
	borderColor?: string;
	noBorder?: boolean;
	noTopBorder?: boolean;
	noLeftBorder?: boolean;
	noRightBorder?: boolean;
	noBottomBorder?: boolean;
	center?: boolean;
	id?: string;
	className?: string;
	children?: React.ReactNode;
}


const Panel: React.FC<IPanel> = ({height, width, top, left, right, bottom, background, borderWidth, borderColor, noBorder, noTopBorder, noLeftBorder, noRightBorder, noBottomBorder, center, className, children, ...props}) => {
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
				background: background,
				borderTop: noBorder || noTopBorder ? 'none' : `${borderWidth || '1px'} solid ${borderColor || '#FFFFFF'}`,
				borderLeft: noBorder || noLeftBorder ? 'none' : `${borderWidth || '1px'} solid ${borderColor || '#FFFFFF'}`,
				borderRight: noBorder || noRightBorder ? 'none' : `${borderWidth || '1px'} solid ${borderColor || '#FFFFFF'}`,
				borderBottom: noBorder || noBottomBorder ? 'none' : `${borderWidth || '1px'} solid ${borderColor || '#FFFFFF'}`,
			}}
		>
			{children}
		</div>
	);
}

export default Panel