import React from 'react';
import GPS from './components/background/GPS';
import Weather from './components/background/Weather';
import Controls from './components/layout/Controls';

import './css/style.css';

function App() {
	return (
		<div id="app">
			<GPS>
				<Weather>
					<Controls />
				</Weather>
			</GPS>
		</div>
	);
}

export default App;
