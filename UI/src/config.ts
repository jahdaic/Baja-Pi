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
	/** GPS HTTP server (pm2 `gps-server`). */
	gpsdServerUrl: env.VITE_GPSD_SERVER_URL || 'http://localhost:8000',

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
