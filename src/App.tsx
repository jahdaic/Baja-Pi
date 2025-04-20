import React from 'react';
import Speedometer from './pages/speedometer';

import './css/style.css';
import GPS from './components/background/GPS';

function App() {
	return (
		<div id="app">
			<GPS>
				<Speedometer />
			</GPS>
		</div>
	);
}

export default App;
