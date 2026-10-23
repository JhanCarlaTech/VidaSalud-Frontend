import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Backend Laravel (php artisan serve)
const API_URL = 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // El proxy hace que la SPA y la API compartan origen: la cookie de sesión
    // y el token CSRF de Sanctum funcionan sin configurar CORS.
    proxy: {
      '/api': { target: API_URL, changeOrigin: true },
      '/sanctum': { target: API_URL, changeOrigin: true },
    },
  },
})
