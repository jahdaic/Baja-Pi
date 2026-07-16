/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
// g3 is a UMD bundle marked "type": "module"; depending on how the bundler
// interops it, the API object surfaces as the module namespace, its `.default`,
// or a global. Resolve whichever actually carries the builders.
import * as g3ns from '@patricksurry/g3/dist/g3.js';

const anyNs = g3ns as any;
const g3: any =
	typeof anyNs?.gauge === 'function'
		? anyNs
		: typeof anyNs?.default?.gauge === 'function'
			? anyNs.default
			: typeof (window as any)?.g3?.gauge === 'function'
				? (window as any).g3
				: undefined;

export interface IG3Gauge {
	/** Live value to display on the gauge. */
	value: number;
	/** Face label shown under the hub, e.g. "MPH". */
	label?: string;
	/** Unique metric key — g3 routes pointer updates to this gauge by name. */
	metric?: string;
	/** Axis range. */
	min?: number;
	max?: number;
	/** Major tick / label step. */
	step?: number;
	/** Rendered size in px (square). */
	size?: number;
	/** Sweep angle in degrees at min / max. */
	startAngle?: number;
	endAngle?: number;
	/** Panel update + transition interval in ms. */
	interval?: number;
}

// g3.panel() targets its container by CSS selector string, so each instance
// needs a unique host id.
let instanceCount = 0;

/**
 * A live radial gauge built with @patricksurry/g3 (D3 + SVG). g3 renders through
 * a `panel` that runs its own update loop; we feed that loop a "fake" generator
 * returning the current value, so the needle animates from live data without
 * rebuilding the SVG on every change. g3 injects its own dark default styling.
 */
const G3Gauge: React.FC<IG3Gauge> = ({
	value,
	label = '',
	metric = 'g3',
	min = 0,
	max = 100,
	step = 10,
	size = 400,
	startAngle = -125,
	endAngle = 125,
	interval = 250,
}) => {
	const hostRef = useRef<HTMLDivElement>(null);
	// The panel loop reads the value through the fake generator; keep the latest
	// in a ref so the loop always sees the current value without a rebuild.
	const valueRef = useRef(value);
	valueRef.current = value;
	const idRef = useRef(`g3-gauge-${(instanceCount += 1)}`);

	// Build the gauge + panel once; the panel then polls valueRef on its own
	// interval. Rebuilding per value change would redraw the whole SVG.
	useEffect(() => {
		const host = hostRef.current;
		if (!host) return undefined;
		if (!g3) {
			console.error('G3Gauge: could not resolve the g3 API from @patricksurry/g3');
			return undefined;
		}

		const timers: number[] = [];
		try {
			const gauge = g3
				.gauge()
				.metric(metric)
				.measure(scaleLinear().domain([min, max]).range([startAngle, endAngle]))
				.fake(() => valueRef.current)
				.append(
					g3.gaugeFace(),
					g3.axisTicks().step(step).size(12),
					g3.axisTicks().step(step / 2).size(6),
					g3.axisLabels().step(step).size(18).inset(24),
					g3.gaugeLabel(label).y(45).size(16),
					g3.indicatePointer(),
				);

			const panel = g3
				.panel()
				.width(size)
				.height(size)
				.interval(interval)
				.append(g3.put().x(size / 2).y(size / 2).scale(size / 280).append(gauge));

			// g3.panel() starts an internal setInterval it never exposes or clears,
			// so on a long-running kiosk each theme switch would leak a timer.
			// Capture the id it creates while rendering so we can stop it on unmount.
			const realSetInterval = window.setInterval;
			window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
				const id = realSetInterval(handler, timeout, ...args);
				timers.push(id as unknown as number);
				return id;
			}) as typeof window.setInterval;
			try {
				panel(`#${idRef.current}`);
			} finally {
				window.setInterval = realSetInterval;
			}
		} catch (err) {
			timers.forEach(clearInterval);
			console.error('G3Gauge: failed to build gauge', err);
			return undefined;
		}

		return () => {
			timers.forEach(clearInterval);
			host.replaceChildren();
		};
	}, []);

	return <div id={idRef.current} ref={hostRef} style={{ width: size, height: size }} />;
};

export default G3Gauge;
