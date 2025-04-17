/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import { G3Gauge, G3GaugeOptions } from "canvas-gauges";
// import * as g3 from '@patricksurry/g3/dist/g3.js';

// import '@patricksurry/g3/dist/g3.js';

export interface IG3Gauge {
	name: string;
	metric: string;
	unit: string;
	value: number;
	height?: string | number;
	width?: string | number;
}

// const defaultOptions {
// 	animation: true,
// 	animatedValue: false,
// 	animationDuration: 250,
// 	animationRule: 'linear',
// 	animateOnInit: false,
// 	valueBox: false
// };

const ReactG3Gauge: React.FC<IG3Gauge> = ({ height = window.innerHeight, width = window.innerHeight, value, ...props}) => {
	// const canvas = useRef<HTMLCanvasElement>(null);
	// const [panel, setPanel] = useState<any>(null);
	// const [gauge, setGauge] = useState<any>(null);

	// useEffect(() => {
	// 	if(!gauge && canvas.current) {
	// 		setGauge(
	// 			window.g3?.gauge('gauge')
	// 			.metric('')
	// 			.unit()
	// 			.measure()
	// 			.range()
	// 			.append();
	// 		);

	// 		setPanel(

	// 		);			
	// 	}

	// 	// gauge?.update({...defaultOptions, ...gauge.options, ...props}).draw();
	// }, [props, canvas.current]);

	// Update value
	// useEffect(() => {
	// 	if(gauge && canvas.current) gauge.value = value || 0;
	// }, [value]);

	// useEffect(() => {
	// 	const newHeight = height.toString().includes('%') ? (canvas.current?.parentElement?.clientHeight || 0) * (Number(height.toString().substring(0, height.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientHeight;
	// 	const newWidth = width.toString().includes('%') ? (canvas.current?.parentElement?.clientWidth || 0) * (Number(width.toString().substring(0, width.toString().length - 1))  / 100) : canvas.current?.parentElement?.clientWidth;

	// 	gauge?.update({...gauge.options, height: newHeight, width: newWidth}).draw();
	// }, [window.innerHeight]);

	return null;

	// return ( <canvas ref={canvas} style={{height, width}} /> );
}

export default ReactG3Gauge