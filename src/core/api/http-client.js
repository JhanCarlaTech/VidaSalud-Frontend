import axios from 'axios'
import { normalizarError } from './error-handler'

/**
 * Cliente HTTP de la API de Laravel.
 *
 * La autenticación es por cookie de sesión (Sanctum en modo SPA), no por token
 * Bearer: las peticiones pasan por el proxy de Vite (mismo origen), así que la
 * cookie de sesión y el token CSRF (XSRF-TOKEN) viajan automáticamente.
 */
const httpClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

/** Evento global que se emite cuando el servidor indica que la sesión expiró. */
export const EVENTO_SESION_EXPIRADA = 'vidasalud:sesion-expirada'

httpClient.interceptors.response.use(
  // Las respuestas exitosas devuelven directamente el cuerpo { success, message, data }.
  (response) => response.data,
  (error) => {
    // Las rutas de autenticación gestionan su propio 401; en el resto implica sesión expirada (E6).
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }

    return Promise.reject(normalizarError(error))
  },
)

/** Inicializa la cookie CSRF de Sanctum antes de iniciar sesión. */
export function obtenerCookieCsrf() {
  return axios.get('/sanctum/csrf-cookie', { withCredentials: true })
}

export default httpClient
