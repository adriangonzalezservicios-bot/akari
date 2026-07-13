import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  server: { host: '0.0.0.0', port: 3000, hmr: process.env.DISABLE_HMR !== 'true', watch: process.env.DISABLE_HMR === 'true' ? null : {} },
  build: {
    sourcemap: true,
    rollupOptions: { output: { manualChunks: {
      react: ['react', 'react-dom'], firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
      query: ['@tanstack/react-query'], motion: ['motion/react'],
    } } },
  },
});
