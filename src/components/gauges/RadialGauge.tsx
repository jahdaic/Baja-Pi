/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { RadialGauge, RadialGaugeOptions } from "canvas-gauges";

export interface IRadialGauge extends Omit<RadialGaugeOptions, 'renderTo' | 'height' | 'width'> {
	height?: string | number;
	width?: string | number;
}

const defaultOptions: Omit<IRadialGauge, 'height' | 'width'> = {
	animation: true,
	animatedValue: false,
	animationDuration: 250,
	animationRule: 'linear',
	animateOnInit: false,
	valueBox: false
};

const ReactRadialGauge: React.FC<IRadialGauge> = ({ height = window.innerHeight, width = window.innerHeight, value, ...props}) => {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [gauge, setGauge] = useState<RadialGauge | null>(null);

	useEffect(() => {
		if(!gauge && canvas.current) setGauge(new RadialGauge({...defaultOptions, ...props, renderTo: canvas.current }).draw());

		gauge?.update({...defaultOptions, ...gauge.options, ...props}).draw();
	}, [props, canvas.current])

	// Update value
	useEffect(() => {
		if(gauge && canvas.current) gauge.value = value || 0;
	}, [value]);

	useEffect(() => {
		const newHeight = height.toString().includes('%') ? (canvas.current?.parentElement?.clientHeight || 0) * (Number(height.toString().substring(0, height.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientHeight;
		const newWidth = width.toString().includes('%') ? (canvas.current?.parentElement?.clientWidth || 0) * (Number(width.toString().substring(0, width.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientWidth;

		gauge?.update({...gauge.options, height: newHeight, width: newWidth}).draw();
	}, [window.innerHeight]);

	return ( <canvas ref={canvas} style={{height, width}} /> );
}

export default ReactRadialGauge