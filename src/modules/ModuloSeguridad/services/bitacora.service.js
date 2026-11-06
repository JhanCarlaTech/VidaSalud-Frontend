import httpClient from '../../../core/api/http-client'

/**
 * CU06 – Consultar Bitácora de Auditoría (solo lectura).
 * @typedef {{ buscar?: string, accion?: string, tabla?: string, ip?: string, desde?: string, hasta?: string, page?: number }} FiltrosBitacora
 */

/** Omite los filtros vacíos para no enviarlos en la URL. */
function parametros(filtros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
}

/**
 * @param {FiltrosBitacora} filtros
 * @returns {Promise<{ items: object[], meta: { pagina_actual: number, ultima_pagina: number, por_pagina: number, total: number } }>}
 */
export async function listarBitacora(filtros = {}) {
  const respuesta = await httpClient.get('/bitacora', { params: parametros(filtros) })
  return respuesta.data
}

/**
 * Acciones y módulos registrados, y el máximo de eventos por exportación.
 * @returns {Promise<{ acciones: { valor: string, etiqueta: string }[], tablas: { valor: string, etiqueta: string }[], maximo_exportacion: number }>}
 */
export async function obtenerCatalogoBitacora() {
  const respuesta = await httpClient.get('/bitacora/catalogo')
  return respuesta.data
}

/** Evento con sus datos y la comparación campo por campo. */
export async function obtenerEvento(id) {
  const respuesta = await httpClient.get(`/bitacora/${id}`)
  return respuesta.data
}

/**
 * CSV con todos los eventos que cumplen los filtros (no se pagina).
 * @param {FiltrosBitacora} filtros
 * @returns {Promise<Blob>}
 */
export async function exportarBitacora(filtros = {}) {
  return httpClient.get('/bitacora/exportar', { params: parametros(filtros), responseType: 'blob' })
}
