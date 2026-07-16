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

export interface IGpsState {
	/** GPS Location data fetched from gpsd-server */
	location: ILocation;
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
};

export const gpsSlice = createSlice({
	name: 'gps',
	initialState,
	reducers: {
		setLocation: (state, action: PayloadAction<ILocation>) => {
			state.location = action.payload;
		},
	},
});

export const { setLocation } = gpsSlice.actions;

export const selectGps = (state: RootState) => state.gps;

export default gpsSlice.reducer;
