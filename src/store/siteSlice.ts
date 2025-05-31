import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Alert, HourlyWeather } from 'openweather-api-node';

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
	timezone: number;
	alerts: Alert[];
}

export interface ISpeedometerState {
	/** The current speed of the vehicle from GPS in miles per hour */
	speed: number;
	/** The current RPM of the vehicle in revolutions per minute */
	rpm: number;
	/** The current fuel level of the vehicle in percentage */
	fuel: number;
	/** The current oil temperature of the vehicle in farenheight */
	oilTemperature: number;
	/** The current oil pressure of the vehicle in PSI */
	oilPressure: number;
	/** The current voltage of the vehicle in volts */
	voltage: number;
	/** The current state of the vehicle's headlights, 0 = off, 1 = regular beams, 2 = high beams */
	headlights: number;
	/** The current state of the vehicle's turn signals, true = on, false = off */
	turnSignal: boolean;
	/** The current state of the vehicle's check engine light, true = on, false = off */
	checkEngine: boolean;
	/** GPS Location data fetched from gpsd-server */
	location: ILocation;
	/** Weather data fetched from Open Weather API */
	weather: IWeather;
	/** Hourly weather forecast fetched from Open Weather API */
	forecast: HourlyWeather[];
	/** The time the speedometer was started, used for calculating elapsed time */
	startTime: number;
}

const initialState: ISpeedometerState = {
	speed: 0,
	rpm: 0,
	fuel: 0,
	oilTemperature: 0,
	oilPressure: 0,
	voltage: 0,
	headlights: 0,
	turnSignal: false,
	checkEngine: false,
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
		timezone: 0,
		alerts: [],
	},
	forecast: [],
	startTime: Date.now(),
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const speedometerSlice = createSlice({
	name: 'speedometer',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setSpeed: (state, action: PayloadAction<number>) => {
			state.speed = action.payload;
		},
		setRPM: (state, action: PayloadAction<number>) => {
			state.rpm = action.payload;
		},
		setFuel: (state, action: PayloadAction<number>) => {
			state.fuel = action.payload;
		},
		setOilTemp: (state, action: PayloadAction<number>) => {
			state.oilTemperature = action.payload;
		},
		setOilPressure: (state, action: PayloadAction<number>) => {
			state.oilPressure = action.payload;
		},
		setVoltage: (state, action: PayloadAction<number>) => {
			state.voltage = action.payload;
		},
		incrementValue: (state, action: PayloadAction<{ name: string; amount: number; max: number }>) => {
			const key = action.payload.name as keyof ISpeedometerState;
			const value: number = Number(state[key]) || 0;

			state[key] = (value + action.payload.amount >= action.payload.max ? 0 : value + action.payload.amount) as never;
		},
		setHeadlights: (state, action: PayloadAction<number>) => {
			state.headlights = action.payload;
		},
		setTurnSignal: (state, action: PayloadAction<boolean>) => {
			state.turnSignal = action.payload;
		},
		setCheckEngine: (state, action: PayloadAction<boolean>) => {
			state.checkEngine = action.payload;
		},
		setLocation: (state, action: PayloadAction<ILocation>) => {
			state.location = action.payload;
		},
		setWeather: (state, action: PayloadAction<IWeather>) => {
			state.weather = action.payload;
		},
		setForecast: (state, action: PayloadAction<HourlyWeather[]>) => {
			state.forecast = action.payload;
		},
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	// extraReducers: (builder) => {
	//   builder
	//     .addCase(incrementAsync.pending, (state) => {
	//       state.status = 'loading';
	//     })
	//     .addCase(incrementAsync.fulfilled, (state, action) => {
	//       state.status = 'idle';
	//       state.value += action.payload;
	//     })
	//     .addCase(incrementAsync.rejected, (state) => {
	//       state.status = 'failed';
	//     });
	// },
});

export const {
	setSpeed,
	setRPM,
	setFuel,
	setOilTemp,
	setOilPressure,
	setVoltage,
	incrementValue,
	setHeadlights,
	setTurnSignal,
	setCheckEngine,
	setLocation,
	setWeather,
	setForecast,
} = speedometerSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSpeedometer = (state: RootState) => state.speedometer;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default speedometerSlice.reducer;
