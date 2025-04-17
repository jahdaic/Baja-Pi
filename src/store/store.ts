import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import speedometerReducer from '../pages/speedometer/speedometerSlice';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    speedometer: speedometerReducer,
    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
