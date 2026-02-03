import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '50c94d357cc3.ngrok-free.app'
    ],
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
