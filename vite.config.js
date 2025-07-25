import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    host: '127.0.0.1',
    port: 3001
  }
})