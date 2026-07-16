import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { preloadFonts } from './scripts/fonts';

const container = document.getElementById('root')!;
const root = createRoot(container);

const render = () =>
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</Provider>
		</React.StrictMode>,
	);

// Preload the custom gauge fonts before the first paint so canvas-gauges never
// draws a theme (e.g. Cyberpunk) with a fallback font. Falls through on timeout.
preloadFonts().finally(render);
