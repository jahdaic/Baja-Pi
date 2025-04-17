import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface SpeedometerState {
	speed: number;
  rpm: number;
  fuel: number;
  oilTemperature: number;
  oilPressure: number;
  voltage: number;
  headlights: number;
  turnSignal: boolean;
  checkEngine: boolean;
  startTime: number;
}

const initialState: SpeedometerState = {
  speed: 88,
  rpm: 4200,
  fuel: 75,
  oilTemperature: 112,
  oilPressure: 40,
  voltage: 12.5,
  headlights: 1,
  turnSignal: true,
  checkEngine: true,
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
    setSpeed: (state, action: PayloadAction<number>) => { state.speed = action.payload; },
    setRPM: (state, action: PayloadAction<number>) => { state.rpm = action.payload; },
    setFuel: (state, action: PayloadAction<number>) => { state.fuel = action.payload; },
    setOilTemp: (state, action: PayloadAction<number>) => { state.oilTemperature = action.payload; },
    setOilPressure: (state, action: PayloadAction<number>) => { state.oilPressure = action.payload; },
    setVoltage: (state, action: PayloadAction<number>) => { state.voltage = action.payload; },
    setHeadlights: (state, action: PayloadAction<number>) => { state.headlights = action.payload; },
    setTurnSignal: (state, action: PayloadAction<boolean>) => { state.turnSignal = action.payload; },
    setCheckEngine: (state, action: PayloadAction<boolean>) => { state.checkEngine = action.payload; },
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
})

export const { setSpeed, setRPM, setFuel, setOilTemp, setOilPressure, setVoltage, setHeadlights, setTurnSignal, setCheckEngine } = speedometerSlice.actions;

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
