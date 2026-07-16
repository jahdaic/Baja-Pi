import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectGps, setLocation } from '../../store/gpsSlice';
import { setSpeed } from '../../store/vehicleSlice';
import * as Utility from '../../scripts/Utility';
import config from '../../config';

export interface IGPS {
	stop?: boolean;
	/** When true, keep updating every GPS value except the vehicle speed, so a
	 *  simulated/test speed on the speedometer isn't overwritten by the live fix. */
	suppressSpeed?: boolean;
	children: React.ReactElement<any, any> | null;
}

const RECONNECT_MIN_MS = 1000;
const RECONNECT_MAX_MS = 15000;

/**
 * Background provider that keeps GPS state fresh from the gps-server over a
 * WebSocket. The server pushes each gpsd TPV the moment it arrives (and the
 * current state on connect), so there's no polling. On disconnect we reconnect
 * with exponential backoff. Refs keep the socket/handlers stable across renders.
 */
const GPS: React.FC<IGPS> = ({ stop, suppressSpeed, children }) => {
	const dispatch = useAppDispatch();
	const { location } = useAppSelector(selectGps);

	const locationRef = useRef(location);
	locationRef.current = location;
	const stopRef = useRef(stop);
	stopRef.current = stop;
	const suppressSpeedRef = useRef(suppressSpeed);
	suppressSpeedRef.current = suppressSpeed;

	const socketRef = useRef<WebSocket | null>(null);
	const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
	const reconnectDelay = useRef(RECONNECT_MIN_MS);
	const unmounted = useRef(false);

	useEffect(() => {
		unmounted.current = false;

		// Map a gpsd TPV onto the store. Uses `??` (not `||`) so a legitimate 0
		// (stopped car, due-north heading) is kept instead of falling back to the
		// previous value; missing fields fall back to the last known value.
		const applyGps = (gps: any) => {
			const prev = locationRef.current;
			const toMph = (v: unknown) => (v != null ? Utility.metersPerSecondToMPH(v as number) : undefined);
			const toFeet = (v: unknown) => (v != null ? Utility.metersToFeet(v as number) : undefined);
			const speedMph = toMph(gps?.speed);

			dispatch(
				setLocation({
					latitude: gps?.lat ?? prev.latitude,
					longitude: gps?.lon ?? prev.longitude,
					altitude: toFeet(gps?.altMSL ?? gps?.alt) ?? prev.altitude,
					speed: speedMph ?? prev.speed,
					heading: gps?.track ?? prev.heading,
					climb: toFeet(gps?.climb) ?? prev.climb,
					error: {
						latitude: toFeet(gps?.epx) ?? prev.error.latitude,
						longitude: toFeet(gps?.epy) ?? prev.error.longitude,
						altitude: toFeet(gps?.epv) ?? prev.error.altitude,
						speed: toMph(gps?.eps) ?? prev.error.speed,
						heading: gps?.epd ?? prev.error.heading,
						climb: toFeet(gps?.epc) ?? prev.error.climb,
						request: '',
					},
				}),
			);
			// In test mode the speedometer runs on a simulated speed, so don't let a
			// live fix (or a no-fix 0) clobber it. Every other GPS value still updates.
			if (!suppressSpeedRef.current) {
				dispatch(setSpeed(speedMph ?? prev.speed));
			}
		};

		const scheduleReconnect = () => {
			if (unmounted.current || stopRef.current) return;
			clearTimeout(reconnectTimer.current);
			reconnectTimer.current = setTimeout(connect, reconnectDelay.current);
			reconnectDelay.current = Math.min(reconnectDelay.current * 2, RECONNECT_MAX_MS);
		};

		function connect() {
			if (unmounted.current || stopRef.current) return;

			let socket: WebSocket;
			try {
				socket = new WebSocket(config.gpsdWsUrl);
			} catch (err) {
				console.error('GPS WS connect failed', err);
				scheduleReconnect();
				return;
			}
			socketRef.current = socket;

			socket.onopen = () => {
				reconnectDelay.current = RECONNECT_MIN_MS; // reset backoff on a good connection
			};
			socket.onmessage = event => {
				try {
					applyGps(JSON.parse(event.data));
				} catch (err) {
					console.error('GPS WS bad message', err);
				}
			};
			socket.onclose = () => {
				socketRef.current = null;
				scheduleReconnect();
			};
			socket.onerror = () => {
				// a close event follows; reconnect is handled there
			};
		}

		connect();

		return () => {
			unmounted.current = true;
			clearTimeout(reconnectTimer.current);
			if (socketRef.current) {
				// Detach handlers first so this intentional close can't schedule a
				// reconnect (avoids a double connection under StrictMode's remount).
				socketRef.current.onclose = null;
				socketRef.current.onerror = null;
				socketRef.current.close();
			}
			socketRef.current = null;
		};
	}, [dispatch]); // dispatch is stable, so this effect still runs once

	return children;
};

export default GPS;
