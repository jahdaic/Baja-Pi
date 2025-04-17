import speedometerReducer, { SpeedometerState, setSpeed } from './speedometerSlice';
  
  describe('speedometer reducer', () => {
	const initialState: SpeedometerState = {
		speed: 12,
		rpm: 34,
		fuel: 56,
		oilTemperature: 112,
		oilPressure: 40,
		voltage: 12.5,
		headlights: 2,
		turnSignal: true,
		checkEngine: true,
		startTime: 1234567890,
	};

	// it('should handle initial state', () => {
	// 	expect(speedometerReducer(undefined, { type: 'unknown' })).toEqual({
	// 		speed: 0, rpm: 0, fuel: 0, headlights: 0, turnSignal: false, checkEngine: false
	// 	});
	// });
  
	it('should handle setSpeed', () => {
	  const actual = speedometerReducer(initialState, setSpeed(69));
	  expect(actual.speed).toEqual(69);
	});
  });
  