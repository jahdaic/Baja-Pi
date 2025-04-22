import React from 'react';
import Speedometer from './pages/speedometer';

import './css/style.css';
import GPS from './components/background/GPS';
import Weather from './components/background/Weather';

function App() {
	return (
		<div id="app">
			<GPS stop>
				<Weather>
					<Speedometer />
				</Weather>
			</GPS>
		</div>
	);
}

export default App;
