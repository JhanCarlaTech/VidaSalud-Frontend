import httpClient from '../../../core/api/http-client'

/**
 * CU05 – Configurar Perfil Personal. Todas las operaciones actúan sobre el usuario de la sesión.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/** @returns {Promise<{ usuario: object, preferencias: { notificar_email: boolean, notificar_push: boolean, horas_anticipacion: number } }>} */
export async function obtenerPerfil() {
  const respuesta = await httpClient.get('/perfil')
  return respuesta.data
}

export async function actualizarPerfil(datos) {
  return httpClient.put('/perfil', datos)
}

export async function cambiarContrasena(datos) {
  return httpClient.put('/perfil/contrasena', datos)
}

export async function actualizarPreferencias(datos) {
  return httpClient.put('/perfil/preferencias', datos)
}

/** @returns {Promise<{ dispositivo: string, ip: string, ultima_actividad: string, actual: boolean }[]>} */
export async function listarSesiones() {
  const respuesta = await httpClient.get('/perfil/sesiones')
  return respuesta.data
}

export async function cerrarOtrasSesiones() {
  return httpClient.delete('/perfil/sesiones')
}

/** @returns {Promise<{ accion: string, ip: string, fecha: string }[]>} */
export async function listarAccesos() {
  const respuesta = await httpClient.get('/perfil/accesos')
  return respuesta.data
}
