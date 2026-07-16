import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

/** A single active weather alert (sourced from NWS /alerts/active). */
export interface IWeatherAlert {
	/** Short event name, e.g. "Tornado Warning" */
	event: string;
	/** Alert onset time, epoch seconds */
	start: number;
	/** Alert end/expiry time, epoch seconds */
	end: number;
	/** Full alert text */
	description: string;
}

/**
 * A single hour of forecast. The nested shape intentionally mirrors the old
 * openweather-api-node `HourlyWeather` so the forecast page consumes it unchanged.
 */
export interface IHourlyForecast {
	/** ISO timestamp for the hour */
	dt: string;
	weather: {
		/** OWM-style icon code, e.g. "01d" */
		icon: { raw: string };
		/** "Feels like" temperature for the hour, in Fahrenheit */
		feelsLike: { cur: number };
		/** Probability of precipitation, 0..1 */
		pop: number;
	};
}

export interface IWeather {
	temperature: number;
	temperatureMin: number;
	temperatureMax: number;
	feelsLike: number;
	description: string;
	icon: string;
	rain: number;
	snow: number;
	windSpeed: number;
	windDirection: number;
	humidity: number;
	pressure: number;
	visibility: number;
	uvi: number;
	sunrise: string;
	sunset: string;
	city: string;
	/** IANA time zone name for the location, e.g. "America/New_York" (from NWS /points) */
	timezone: string;
	alerts: IWeatherAlert[];
}

export interface IWeatherState {
	/** Weather data fetched from the weather service (NWS + Open-Meteo) */
	weather: IWeather;
	/** Hourly weather forecast fetched from the weather service */
	forecast: IHourlyForecast[];
}

const initialState: IWeatherState = {
	weather: {
		temperature: 0,
		temperatureMin: 0,
		temperatureMax: 0,
		feelsLike: 0,
		description: '',
		icon: '',
		rain: 0,
		snow: 0,
		windSpeed: 0,
		windDirection: 0,
		humidity: 0,
		pressure: 0,
		visibility: 0,
		uvi: 0,
		sunrise: '',
		sunset: '',
		city: '',
		timezone: '',
		alerts: [],
	},
	forecast: [],
};

export const weatherSlice = createSlice({
	name: 'weather',
	initialState,
	reducers: {
		setWeather: (state, action: PayloadAction<IWeather>) => {
			state.weather = action.payload;
		},
		setForecast: (state, action: PayloadAction<IHourlyForecast[]>) => {
			state.forecast = action.payload;
		},
	},
});

export const { setWeather, setForecast } = weatherSlice.actions;

export const selectWeather = (state: RootState) => state.weather;

export default weatherSlice.reducer;
