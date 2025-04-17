/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {LinearGauge, LinearGaugeOptions} from 'canvas-gauges';

export interface ILinearGauge extends Omit<LinearGaugeOptions, 'renderTo' | 'height' | 'width'> {
	height?: string | number;
	width?: string | number;
}

const defaultOptions: Omit<ILinearGauge, 'height' | 'width'> = {
	animation: true,
	animatedValue: false,
	animationDuration: 250,
	animationRule: 'linear',
	animateOnInit: false,
	valueBox: false
};

const ReactLinearGauge: React.FC<ILinearGauge> = ({height = '100%', width = '100%', value, ...props}) => {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [gauge, setGauge] = useState<LinearGauge | null>(null);

	useEffect(() => {
		if(!gauge && canvas.current) setGauge(new LinearGauge({...defaultOptions, ...props, renderTo: canvas.current }).draw());

		gauge?.update({...defaultOptions, ...gauge.options, ...props}).draw();
	}, [props, canvas.current]);

	// Update value
	useEffect(() => {
		if(gauge && canvas.current) gauge.value = Math.min(value || 0, gauge.options.maxValue || 0, props.maxValue || 0) || 0;
	}, [value]);

	useEffect(() => {
		const newHeight = height.toString().includes('%') ? (canvas.current?.parentElement?.clientHeight || 0) * (Number(height.toString().substring(0, height.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientHeight;
		const newWidth = width.toString().includes('%') ? (canvas.current?.parentElement?.clientWidth || 0) * (Number(width.toString().substring(0, width.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientWidth;

		gauge?.update({...gauge.options, height: newHeight, width: newWidth}).draw();
	}, [window.innerHeight]);

	return ( <canvas ref={canvas} style={{height, width}} /> );
}

export default ReactLinearGauge