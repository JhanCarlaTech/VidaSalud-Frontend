import httpClient from '../../../core/api/http-client'

/**
 * CU02 – Gestionar Usuarios y Asignar Roles.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * @param {{ buscar?: string, rol?: number|string, activo?: '1'|'0'|'', page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: { pagina_actual: number, ultima_pagina: number, por_pagina: number, total: number } }>}
 */
export async function listarUsuarios(filtros = {}) {
  // Se omiten los filtros vacíos para no enviarlos en la URL.
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/usuarios', { params })
  return respuesta.data
}

export async function obtenerUsuario(id) {
  const respuesta = await httpClient.get(`/usuarios/${id}`)
  return respuesta.data
}

export async function crearUsuario(datos) {
  const respuesta = await httpClient.post('/usuarios', datos)
  return respuesta
}

export async function actualizarUsuario(id, datos) {
  const respuesta = await httpClient.put(`/usuarios/${id}`, datos)
  return respuesta
}

export async function cambiarEstadoUsuario(id, activo) {
  const respuesta = await httpClient.patch(`/usuarios/${id}/estado`, { activo })
  return respuesta
}
