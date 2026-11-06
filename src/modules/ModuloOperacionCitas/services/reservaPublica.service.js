import httpClient from '../../../core/api/http-client'

/**
 * Reserva en línea desde la página principal (CU13): catálogos públicos que
 * se consultan sin sesión. Cada función devuelve el campo `data`.
 */

/** @returns {Promise<{ id: number, nombre: string, descripcion: string|null, precio_consulta: number, medicos_activos: number }[]>} */
export async function listarEspecialidadesPublicas() {
  const respuesta = await httpClient.get('/publico/especialidades')
  return respuesta.data
}

/** Médicos activos de una especialidad, con sus días de atención (1 = lunes). */
export async function listarMedicosPublicos(idEspecialidad) {
  const respuesta = await httpClient.get('/publico/medicos', { params: { especialidad: idEspecialidad } })
  return respuesta.data
}

/** @param {string} fecha  'AAAA-MM-DD' */
export async function obtenerDisponibilidadPublica(idMedico, fecha) {
  const respuesta = await httpClient.get(`/publico/medicos/${idMedico}/disponibilidad`, { params: { fecha } })
  return respuesta.data
}

/** @returns {Promise<{ id: number, nombre: string }[]>} */
export async function listarModalidadesPublicas() {
  const respuesta = await httpClient.get('/publico/modalidades')
  return respuesta.data
}
