import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 3005, // Your VPS port
    cors: true, // Enable CORS for video files
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Ensure video files are properly served
  assetsInclude: ['**/*.mp4', '**/*.webm', '**/*.ogg']
})