import httpClient, { obtenerCookieCsrf } from '../../../core/api/http-client'

/**
 * CU01 – Autenticar y Gestionar Sesión.
 * Cada función devuelve el campo `data` de la respuesta estándar de la API.
 */

/**
 * @param {{ correo: string, contrasena: string }} credenciales
 * @returns {Promise<{ usuario: object, roles: string[], rol_principal: string, permisos: string[], ruta_inicio: string }>}
 */
export async function iniciarSesion(credenciales) {
  await obtenerCookieCsrf()
  const respuesta = await httpClient.post('/auth/login', credenciales)
  return respuesta.data
}

/**
 * Autorregistro de un paciente (CU11, RN07). Deja la sesión iniciada y
 * devuelve el mismo contexto que el login.
 */
export async function registrarPaciente(datos) {
  await obtenerCookieCsrf()
  const respuesta = await httpClient.post('/auth/registro', datos)
  return respuesta
}

export async function obtenerSesion() {
  const respuesta = await httpClient.get('/auth/me')
  return respuesta.data
}

export async function cerrarSesion() {
  await httpClient.post('/auth/logout')
}
