import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tools/rubber-weather-calendar/',
  build: {
    outDir: 'dist',
  },
});
