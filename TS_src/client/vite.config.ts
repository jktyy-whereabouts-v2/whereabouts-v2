import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), EnvironmentPlugin(['GOOGLEMAPSID', 'GOOGLEMAPSAPIKEY'])],
	server: {
		port: 3000,
		proxy: {
			'/api': 'http://localhost:3500',
			'/socket.io': 'http://localhost:3500' 
		  }
	},
});
