import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tools/pic-6varieties/',
  build: {
    outDir: 'dist',
  },
});
