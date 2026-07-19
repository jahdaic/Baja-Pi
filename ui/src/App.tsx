import React from 'react';
import GPS from './components/background/GPS';
import Weather from './components/background/Weather';
import Controls from './components/layout/Controls';

import './css/style.css';

function App() {
	// Dev test mode: Controls simulates the vehicle values, and GPS stops writing
	// speed so the simulated speedometer needle isn't overwritten by the live fix.
	const test = false;

	return (
		<div id="app">
			<GPS suppressSpeed={test}>
				<Weather>
					<Controls test={test} />
				</Weather>
			</GPS>
		</div>
	);
}

export default App;
