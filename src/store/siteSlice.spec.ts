import speedometerReducer, { ISpeedometerState, setSpeed } from './siteSlice';

describe('speedometer reducer', () => {
	const initialState: ISpeedometerState = {
		speed: 12,
		rpm: 34,
		fuel: 56,
		oilTemperature: 112,
		oilPressure: 40,
		voltage: 12.5,
		headlights: 2,
		turnSignal: true,
		checkEngine: true,
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
