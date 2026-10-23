import httpClient from '../../../core/api/http-client'

/**
 * CU11 – Gestionar Pacientes.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * @param {{ buscar?: string, activo?: '1'|'0'|'', page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: object }>}
 */
export async function listarPacientes(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/pacientes', { params })
  return respuesta.data
}

export async function crearPaciente(datos) {
  return httpClient.post('/pacientes', datos)
}

export async function actualizarPaciente(id, datos) {
  return httpClient.put(`/pacientes/${id}`, datos)
}

export async function cambiarEstadoPaciente(id, activo) {
  return httpClient.patch(`/pacientes/${id}/estado`, { activo })
}

/** Ficha médica del paciente de la sesión (RN08). */
export async function obtenerMiFicha() {
  const respuesta = await httpClient.get('/mi-ficha')
  return respuesta.data
}

/** @param {{ tipo_sangre: string|null, contacto: object|null }} datos */
export async function actualizarMiFicha(datos) {
  return httpClient.put('/mi-ficha', datos)
}
