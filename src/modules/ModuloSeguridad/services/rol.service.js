import httpClient from '../../../core/api/http-client'

/**
 * CU03 – Gestionar Roles y Asignar Permisos (el listado también lo usa CU02).
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * @param {{ activos?: boolean }} opciones  activos: solo los roles asignables.
 */
export async function listarRoles({ activos = false } = {}) {
  const respuesta = await httpClient.get('/roles', { params: activos ? { activos: 1 } : {} })
  return respuesta.data
}

export async function crearRol(datos) {
  return httpClient.post('/roles', datos)
}

export async function actualizarRol(id, datos) {
  return httpClient.put(`/roles/${id}`, datos)
}

export async function cambiarEstadoRol(id, activo) {
  return httpClient.patch(`/roles/${id}/estado`, { activo })
}
