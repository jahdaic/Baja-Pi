import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface IVehicleState {
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
	/** The time the dashboard was started, used for calculating elapsed time */
	startTime: number;
}

const initialState: IVehicleState = {
	speed: 0,
	rpm: 0,
	fuel: 0,
	oilTemperature: 0,
	oilPressure: 0,
	voltage: 0,
	headlights: 0,
	turnSignal: false,
	checkEngine: false,
	startTime: Date.now(),
};

export const vehicleSlice = createSlice({
	name: 'vehicle',
	initialState,
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
			const key = action.payload.name as keyof IVehicleState;
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
	},
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
} = vehicleSlice.actions;

export const selectVehicle = (state: RootState) => state.vehicle;

export default vehicleSlice.reducer;
