import httpClient from '../../../core/api/http-client'

/**
 * CU20 – Gestionar Notificaciones y Recordatorios.
 * Las consultas devuelven el campo `data`; las acciones devuelven la respuesta
 * completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/** Evento global para refrescar el contador del menú después de leer notificaciones. */
export const EVENTO_NOTIFICACIONES_LEIDAS = 'vidasalud:notificaciones-leidas'

function parametros(filtros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null && valor !== false))
}

// --- Bandeja del paciente ---------------------------------------------------

/** @returns {Promise<{ items: object[], meta: object, no_leidas: number }>} */
export async function listarMisNotificaciones({ noLeidas = false, page = 1 } = {}) {
  const respuesta = await httpClient.get('/mis-notificaciones', { params: parametros({ no_leidas: noLeidas ? 1 : '', page }) })
  return respuesta.data
}

/** @returns {Promise<number>} */
export async function contarNoLeidas() {
  const respuesta = await httpClient.get('/mis-notificaciones/resumen')
  return respuesta.data.no_leidas
}

export async function marcarLeida(id) {
  const respuesta = await httpClient.patch(`/mis-notificaciones/${id}/leida`)
  window.dispatchEvent(new Event(EVENTO_NOTIFICACIONES_LEIDAS))
  return respuesta
}

export async function marcarTodasLeidas() {
  const respuesta = await httpClient.patch('/mis-notificaciones/leer-todas')
  window.dispatchEvent(new Event(EVENTO_NOTIFICACIONES_LEIDAS))
  return respuesta
}

// --- Recepción y Administración ---------------------------------------------

/**
 * @param {{ buscar?: string, tipo?: string, estado_correo?: string, desde?: string, hasta?: string, page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: object, tipos: { valor: string, etiqueta: string }[] }>}
 */
export async function listarNotificaciones(filtros = {}) {
  const respuesta = await httpClient.get('/notificaciones', { params: parametros(filtros) })
  return respuesta.data
}

/** @param {{ id_paciente: number, id_cita?: number | null, mensaje: string }} datos */
export async function enviarAviso(datos) {
  return httpClient.post('/notificaciones', datos)
}

export async function reenviarNotificacion(id) {
  return httpClient.post(`/notificaciones/${id}/reenviar`)
}

export async function ejecutarRecordatorios() {
  return httpClient.post('/notificaciones/recordatorios')
}
