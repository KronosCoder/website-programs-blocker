import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '960575492761.ngrok-free.app'
    ],
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
