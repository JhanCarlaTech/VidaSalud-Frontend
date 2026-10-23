import httpClient from '../../../core/api/http-client'

/**
 * CU07 – Gestionar Especialidades Médicas.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * @param {{ buscar?: string, activo?: '1' | '0' | '' }} filtros
 * @returns {Promise<{ id: number, nombre: string, descripcion: string|null, activo: boolean, medicos_activos: number, medicos: object[] }[]>}
 */
export async function listarEspecialidades(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/especialidades', { params })
  return respuesta.data
}

export async function crearEspecialidad(datos) {
  return httpClient.post('/especialidades', datos)
}

export async function actualizarEspecialidad(id, datos) {
  return httpClient.put(`/especialidades/${id}`, datos)
}

export async function cambiarEstadoEspecialidad(id, activo) {
  return httpClient.patch(`/especialidades/${id}/estado`, { activo })
}
