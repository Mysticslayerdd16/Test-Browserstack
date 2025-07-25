import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false, // Set to true if you want the browser to open automatically
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});