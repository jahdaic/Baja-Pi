/**
 * Central, validated application config.
 *
 * Every VITE_* env var is read and coerced to a finite number ONCE here, with a
 * sane fallback, so a missing / blank / non-numeric value can never reach the
 * gauges. (Some themes do `Array(Number(env)/1000+1)`, where a NaN would throw
 * `RangeError` and blank the whole dashboard.) Import `config` instead of reading
 * `import.meta.env.VITE_*` directly.
 */

const num = (raw: string | undefined, fallback: number): number => {
	const n = Number(raw);
	return Number.isFinite(n) ? n : fallback;
};

const env = import.meta.env;

export const config = {
	/** GPS HTTP server (pm2 `gps-server`) — health/fallback endpoint. */
	gpsdServerUrl: env.VITE_GPSD_SERVER_URL || 'http://localhost:8000',
	/** GPS WebSocket URL (same server, ws:// scheme) for live TPV push. */
	gpsdWsUrl: (env.VITE_GPSD_SERVER_URL || 'http://localhost:8000').replace(/^http/, 'ws'),

	/** Control server (pm2 `control-server`) — backs the long-press menu's
	 *  reboot / shutdown / Chromium actions. Localhost only. */
	controlServerUrl: env.VITE_CONTROL_SERVER_URL || 'http://localhost:8100',

	/** GPS data cadence — the interval (ms) between live GPS pushes. Drives the
	 *  animation duration of GPS-fed gauges (the speedometer) so the needle glides
	 *  between samples instead of dwelling/lagging. Keep in sync with the u-blox
	 *  output rate: 1000 = the receiver's default 1 Hz. */
	gps: {
		updateMs: num(env.VITE_GPS_UPDATE_MS, 1000),
	},

	speed: {
		limit: num(env.VITE_SPEED_LIMIT, 80),
	},
	rpm: {
		minVoltage: num(env.VITE_RPM_MIN_VOLTAGE, 0),
		maxVoltage: num(env.VITE_RPM_MAX_VOLTAGE, 5),
		limit: num(env.VITE_RPM_LIMIT, 7000),
		redline: num(env.VITE_RPM_REDLINE, 5000),
	},
	fuel: {
		minVoltage: num(env.VITE_FUEL_MIN_VOLTAGE, 0),
		maxVoltage: num(env.VITE_FUEL_MAX_VOLTAGE, 5),
		reserve: num(env.VITE_FUEL_RESERVE, 0),
	},
	oilTemp: {
		minVoltage: num(env.VITE_OIL_TEMP_MIN_VOLTAGE, 0),
		maxVoltage: num(env.VITE_OIL_TEMP_MAX_VOLTAGE, 5),
		redline: num(env.VITE_OIL_TEMP_REDLINE, 225),
		limit: num(env.VITE_OIL_TEMP_LIMIT, 300),
	},
	oilPressure: {
		minVoltage: num(env.VITE_OIL_PRESSURE_MIN_VOLTAGE, 0),
		maxVoltage: num(env.VITE_OIL_PRESSURE_MAX_VOLTAGE, 5),
		redline: num(env.VITE_OIL_PRESSURE_REDLINE, 3),
		limit: num(env.VITE_OIL_PRESSURE_LIMIT, 70),
	},
	voltage: {
		minVoltage: num(env.VITE_VOLTAGE_MIN_VOLTAGE, 0),
		maxVoltage: num(env.VITE_VOLTAGE_MAX_VOLTAGE, 5),
		redline: num(env.VITE_VOLTAGE_REDLINE, 9),
		limit: num(env.VITE_VOLTAGE_LIMIT, 14),
	},
};

export default config;
