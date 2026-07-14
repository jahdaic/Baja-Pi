import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true, // listen on all interfaces (handy for testing from another device)
		port: 5173,
	},
	build: {
		outDir: 'dist',
	},
});
