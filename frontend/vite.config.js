// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // true = allow ANY host (ngrok, localhost, everything)
    // no more updating this every time ngrok restarts
    allowedHosts: true,
  }
})