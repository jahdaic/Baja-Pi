import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import vehicleReducer from './vehicleSlice';
import gpsReducer from './gpsSlice';
import weatherReducer from './weatherSlice';

export const store = configureStore({
	reducer: {
		vehicle: vehicleReducer,
		gps: gpsReducer,
		weather: weatherReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
