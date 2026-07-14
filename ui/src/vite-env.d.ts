/// <reference types="vite/client" />

interface ImportMetaEnv {
	// App settings
	readonly VITE_GPSD_SERVER_URL: string;
	readonly VITE_OPEN_WEATHER_API_KEY: string;

	// Gauge settings
	readonly VITE_SPEED_LIMIT: string;

	readonly VITE_RPM_MIN_VOLTAGE: string;
	readonly VITE_RPM_MAX_VOLTAGE: string;
	readonly VITE_RPM_LIMIT: string;
	readonly VITE_RPM_REDLINE: string;

	readonly VITE_FUEL_MIN_VOLTAGE: string;
	readonly VITE_FUEL_MAX_VOLTAGE: string;
	readonly VITE_FUEL_RESERVE: string;

	readonly VITE_OIL_TEMP_MIN_VOLTAGE: string;
	readonly VITE_OIL_TEMP_MAX_VOLTAGE: string;
	readonly VITE_OIL_TEMP_REDLINE: string;
	readonly VITE_OIL_TEMP_LIMIT: string;

	readonly VITE_OIL_PRESSURE_MIN_VOLTAGE: string;
	readonly VITE_OIL_PRESSURE_MAX_VOLTAGE: string;
	readonly VITE_OIL_PRESSURE_REDLINE: string;
	readonly VITE_OIL_PRESSURE_LIMIT: string;

	readonly VITE_VOLTAGE_MIN_VOLTAGE: string;
	readonly VITE_VOLTAGE_MAX_VOLTAGE: string;
	readonly VITE_VOLTAGE_REDLINE: string;
	readonly VITE_VOLTAGE_LIMIT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
