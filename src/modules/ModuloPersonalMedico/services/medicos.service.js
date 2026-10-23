import httpClient from '../../../core/api/http-client'

/**
 * CU08 – Gestionar Personal Médico.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * @param {{ buscar?: string, especialidad?: number|string, activo?: '1'|'0'|'', page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: object }>}
 */
export async function listarMedicos(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/medicos', { params })
  return respuesta.data
}

export async function crearMedico(datos) {
  return httpClient.post('/medicos', datos)
}

export async function actualizarMedico(id, datos) {
  return httpClient.put(`/medicos/${id}`, datos)
}

export async function cambiarEstadoMedico(id, activo) {
  return httpClient.patch(`/medicos/${id}/estado`, { activo })
}
