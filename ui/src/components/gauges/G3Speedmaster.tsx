/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
// The Omega Speedmaster (and its custom omega-* hand shapes + filter defs) lives
// in g3's contrib bundle. Same UMD/"type":"module" interop dance as G3Gauge.
import * as g3ns from '@patricksurry/g3/dist/g3-contrib.js';
import config from '../../config';
import { useAppSelector } from '../../store/hooks';
import { selectVehicle } from '../../store/vehicleSlice';

const anyNs = g3ns as any;
const g3: any =
	typeof anyNs?.panel === 'function'
		? anyNs
		: typeof anyNs?.default?.panel === 'function'
			? anyNs.default
			: typeof (window as any)?.g3?.panel === 'function'
				? (window as any).g3
				: undefined;

// Standard automotive sweep: min at lower-left (-135deg), round over the top to
// max at lower-right (135deg), leaving the gap at the bottom.
const A0 = -135;
const A1 = 135;

let instanceCount = 0;

export interface IG3Speedmaster {
	/** Rendered size in px (square). */
	size?: number;
}

/**
 * The Omega Speedmaster's chrome (bezel, subdials, hands, filters) repurposed as
 * a vehicle chronograph: minute hand = speed, second hand = rpm, hour hand parked
 * at 2 o'clock, subdials = oil pressure / voltage / oil temp, window = fuel %.
 * Values are read live from the vehicle store; g3's panel loop pulls them through
 * per-metric "fake" generators so the hands animate without rebuilding the SVG.
 */
const G3Speedmaster: React.FC<IG3Speedmaster> = ({ size = 720 }) => {
	const hostRef = useRef<HTMLDivElement>(null);
	const idRef = useRef(`g3-speedmaster-${(instanceCount += 1)}`);

	const vehicle = useAppSelector(selectVehicle);
	// Keep the latest values in a ref the g3 fake generators read each tick.
	const vRef = useRef(vehicle);
	vRef.current = vehicle;

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return undefined;
		if (!g3 || typeof g3.gauge !== 'function') {
			console.error('G3Speedmaster: g3 API unavailable', { g3: typeof g3 });
			return undefined;
		}

		const timers: number[] = [];
		try {
			const {
				gauge,
				gaugeFace,
				gaugeLabel,
				axisLine,
				axisSector,
				axisTicks,
				axisLabels,
				indicatePointer,
				indicateText,
				put,
				panel,
			} = g3;

			// A small round subdial (like the chrono counters) for a vehicle metric.
			// Numbers + pointer sweep the standard -135..135 arc (lower-left -> lower-right);
			// the fill + outline ring are on a full circle so they close at the top.
			const subdial = (
				metric: string,
				get: () => number,
				min: number,
				max: number,
				labelStep: number,
				tickStep: number,
				title: string,
			) => {
				// tick positions at tickStep, skipping the ones that land on a number
				const ticks: number[] = [];
				for (let v = min; v <= max + tickStep / 2; v += tickStep) {
					if (Math.abs(v / labelStep - Math.round(v / labelStep)) > 1e-6) ticks.push(v);
				}
				return gauge()
					.metric(metric)
					.fake(get)
					.measure(scaleLinear().domain([min, max]).range([-135, 135]))
					.append(
						gaugeFace(),
						gauge()
							.measure(scaleLinear().domain([0, 1]).range([0, 360]))
							.append(
								axisSector().size(50).style('fill: #282828'),
								axisLine().style('stroke: #aaa; stroke-width: 4'),
							),
						axisTicks(ticks).inset(5).size(10).style('stroke: white'),
						axisLabels().step(labelStep).size(34),
						gaugeLabel(title, { size: 22, y: 78 }),
						indicatePointer().shape('sword'),
					);
			};

			// RPM minor-tick positions (every 100), excluding the 500 marks so the dots
			// and numbers stay clean. The band runs 1/3 past 7000 to fill the bottom gap.
			const rpmBandMax = (config.rpm.limit * 4) / 3;
			const rpmMinorTicks: number[] = [];
			for (let v = 0; v <= rpmBandMax; v += 100) if (v % 500 !== 0) rpmMinorTicks.push(v);

			// Speed ticks (like the original face): tiny ticks every 0.5 mph plus medium
			// ticks at the 5-marks. Tiny ticks skip the 5-marks and clear a small gap
			// around each labeled 10 so none touch a number.
			const speedTiny: number[] = [];
			const speedMed: number[] = [];
			for (let i = 0; i <= config.speed.limit * 2; i += 1) {
				const v = i / 2;
				if (v % 5 === 0) {
					if (v % 10 !== 0) speedMed.push(v);
				} else if (Math.abs(v - 10 * Math.round(v / 10)) > 0.75) {
					speedTiny.push(v);
				}
			}

			const main = gauge()
				.metric('speed')
				.fake(() => vRef.current.speed)
				.measure(scaleLinear().domain([0, config.speed.limit]).range([A0, A1]))
				.css(
					`
.g3-pointer-hub, .g3-pointer-blade {fill: #ddd; stroke: #ddd}
text {fill: #ccc}
`,
				)
				.append(
					// --- watch chrome (kept from the Speedmaster) ---
					gaugeFace(),
					gaugeFace().r(45).style('fill: #282828'),
					// Outline + bezel rings on a full-circle measure so they don't inherit
					// the speed sweep's gap at the top.
					gauge()
						.measure(scaleLinear().domain([0, 1]).range([0, 360]))
						.append(
							axisLine().style('stroke-width: 4; stroke: #aaa'),
							axisSector().inset(14).size(10).style('fill: #aaa'),
							axisSector().inset(17).size(1).style('fill: white; filter: url(#gaussianBlur1)'),
						),

					// --- outer ring: RPM — un-flipped; labels lower-left -> lower-right ---
					// Full-circle tick band aligned to the RPM cadence (minor every 100,
					// major every 500) so it closes all the way around; the domain extends
					// past the 7000 arc-end to fill the bottom gap at the same spacing.
					gauge()
						.measure(scaleLinear().domain([0, rpmBandMax]).range([-135, 225]))
						.append(
							axisTicks(rpmMinorTicks).inset(12).size(-4).style('stroke: white'),
							// dots at the labeled (500-rpm) marks — like the original tachymetre,
							// so they sit beside the numbers instead of crossing them
							axisTicks().step(500).shape('dot').size(0.9).inset(12).style('fill: #ccc'),
						),
					// RPM labels on the visible arc only — every 500 rpm, shown in hundreds
					gauge()
						.metric('rpm')
						.measure(scaleLinear().domain([0, config.rpm.limit]).range([-135, 135]))
						.append(
							axisLabels()
								.step(500)
								.inset(6)
								.size(6)
								.format((v: number) => Math.round(v / 100)),
						),
					// "×100 RPM" caption curving along the bottom of the RPM ring
					gauge()
						.measure(scaleLinear().domain([0, 360]).range([0, 360]))
						.append(axisLabels({ 180: '×100 RPM' }).orient('counterclockwise').inset(4).size(5)),
					gaugeLabel('BAJA PI', { x: 28, y: 0, size: 6, style: 'font-weight: bold' }),

					// --- inner ring: SPEED (main scale) ---
					// tiny ticks every 0.5 mph + medium ticks at the 5-marks, both skipping
					// the labeled 10s so nothing lands on a number (like the original face)
					put()
						.scale(0.72)
						.append(
							axisTicks(speedTiny).size(3).style('stroke: white'),
							axisTicks(speedMed).size(9).style('stroke: white'),
							axisLabels().step(config.speed.limit / 8).inset(2.5).size(9).orient('relative'),
							gaugeLabel('MPH', { y: 62, size: 8 }),
						),

					// --- fuel window at 3 o'clock (aperture + frame + 2-digit readout) ---
					// aperture + frame on a full-circle measure so they stay at 3 o'clock
					gauge()
						.measure(scaleLinear().domain([0, 360]).range([0, 360]))
						.append(
							axisSector([82, 98]).inset(36).size(19).style('fill: black'),
							axisSector([82, 98]).inset(36).size(19).style('fill: none; stroke: #ccc; stroke-width: 2'),
						),
					put()
						.x(55)
						.append(
							gauge()
								.metric('fuel')
								.fake(() => vRef.current.fuel)
								.measure(scaleLinear().domain([0, 100]).range([A0, A1]))
								.append(
									indicateText()
										.format((v: number) => String(Math.round(v)).padStart(2, '0'))
										.size(11)
										.style('fill: #ccc'),
								),
						),

					// --- subdials ---
					put()
						.x(-42)
						.scale(0.25)
						.append(subdial('oilPressure', () => vRef.current.oilPressure, 0, config.oilPressure.limit, config.oilPressure.limit / 5, 2, 'PSI')),
					put()
						.y(-42)
						.scale(0.25)
						.append(subdial('voltage', () => vRef.current.voltage, 0, config.voltage.limit, config.voltage.limit / 2, 1, 'V')),
					put()
						.y(42)
						.scale(0.25)
						.append(subdial('oilTemp', () => vRef.current.oilTemperature, 0, config.oilTemp.limit, config.oilTemp.limit / 4, 25, '°F')),

					// --- hands: minute = speed; hour drifts 50->60 mph by speed %; second = rpm ---
					put()
						.scale(0.75)
						.append(
							// Hour hand on its own metric so it's decoupled from the live speed
							// (only the minute hand tracks it): sits ~55 mph, drifting 50->60
							// as vehicle speed goes 0 -> max.
							gauge()
								.metric('speedHour')
								.fake(() => 50 + 10 * (vRef.current.speed / config.speed.limit))
								.measure(scaleLinear().domain([0, config.speed.limit]).range([A0, A1]))
								.append(indicatePointer().shape('omega-baton-short')),
							indicatePointer().shape('omega-baton-long'),
							gauge()
								.metric('rpm')
								.fake(() => vRef.current.rpm)
								.measure(scaleLinear().domain([0, config.rpm.limit]).range([-135, 135]))
								.append(indicatePointer().shape('omega-second')),
						),
				);

			const p = panel()
				.width(size)
				.height(size)
				.append(put().x(size / 2).y(size / 2).scale(size / 201).append(main));

			const realSetInterval = window.setInterval;
			window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
				const id = realSetInterval(handler, timeout, ...args);
				timers.push(id as unknown as number);
				return id;
			}) as typeof window.setInterval;
			try {
				p(`#${idRef.current}`);
			} finally {
				window.setInterval = realSetInterval;
			}
		} catch (err) {
			timers.forEach(clearInterval);
			console.error('G3Speedmaster: build failed', err);
			return undefined;
		}

		return () => {
			timers.forEach(clearInterval);
			host.replaceChildren();
		};
	}, []);

	return <div id={idRef.current} ref={hostRef} style={{ width: size, height: size }} />;
};

export default G3Speedmaster;
