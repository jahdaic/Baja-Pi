import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface ILocation {
	/** Latitude in degrees: +/- signifies North/South */
	latitude: number;
	/** Longitude in degrees: +/- signifies East/West */
	longitude: number;
	/** Mean sea level altitude in feet */
	altitude: number;
	/** Speed over ground, miles per hour */
	speed: number;
	/** Course over ground, degrees from true north */
	heading: number;
	/** Climb (positive) or sink (negative) rate, feet per second */
	climb: number;
	/** Estimated margins of error */
	error: {
		/** Latitude error estimate in feet  */
		latitude: number;
		/** Longitude error estimate in feet */
		longitude: number;
		/** Estimated vertical error in feet */
		altitude: number;
		/** Estimated speed error in miles per hour */
		speed: number;
		/** Estimated track (direction) error in degrees */
		heading: number;
		/** Estimated climb error in feet per second */
		climb: number;
		/** Last error received from Fetch request */
		request: string;
	};
}

/** A single satellite from the receiver's sky view. */
export interface ISatellite {
	/** Satellite PRN / id */
	prn: number;
	/** gpsd constellation id (0 GPS, 2 Galileo, 3 BeiDou, 6 GLONASS, …) */
	gnss?: number;
	/** Elevation above the horizon, degrees */
	elevation: number;
	/** Azimuth, degrees from true north */
	azimuth: number;
	/** Signal strength, dB-Hz (0 if not reported) */
	snr: number;
	/** Whether this satellite is used in the current fix */
	used: boolean;
}

/** Satellite health derived from gpsd SKY reports. */
export interface ISatelliteInfo {
	/** Satellites in view (includes almanac-predicted with no signal) */
	seen: number;
	/** Satellites actually being received (SNR > 0) */
	tracked: number;
	/** Satellites used in the fix */
	used: number;
	/** Signal strength summary (dB-Hz); null when nothing is in view */
	snr: { max: number | null; avg: number | null };
	/** Horizontal dilution of precision (lower is better); null until known */
	hdop: number | null;
	/** Per-satellite detail */
	list: ISatellite[];
}

export interface IGpsState {
	/** GPS Location data fetched from gpsd-server */
	location: ILocation;
	/** Milliseconds since the last fix; null until the first fix */
	age: number | null;
	/** True when the fix is stale / the signal is lost (older than the server's window, or never seen) */
	stale: boolean;
	/** Satellites in view / used and signal strength */
	satellites: ISatelliteInfo;
}

const initialState: IGpsState = {
	location: {
		latitude: 0,
		longitude: 0,
		altitude: 0,
		speed: 0,
		heading: 0,
		climb: 0,
		error: {
			latitude: 0,
			longitude: 0,
			altitude: 0,
			speed: 0,
			heading: 0,
			climb: 0,
			request: '',
		},
	},
	age: null,
	stale: true,
	satellites: {
		seen: 0,
		tracked: 0,
		used: 0,
		snr: { max: null, avg: null },
		hdop: null,
		list: [],
	},
};

export const gpsSlice = createSlice({
	name: 'gps',
	initialState,
	reducers: {
		setLocation: (state, action: PayloadAction<ILocation>) => {
			state.location = action.payload;
		},
		setGpsMeta: (
			state,
			action: PayloadAction<{ age: number | null; stale: boolean; satellites: ISatelliteInfo }>,
		) => {
			state.age = action.payload.age;
			state.stale = action.payload.stale;
			state.satellites = action.payload.satellites;
		},
	},
});

export const { setLocation, setGpsMeta } = gpsSlice.actions;

export const selectGps = (state: RootState) => state.gps;

export default gpsSlice.reducer;
