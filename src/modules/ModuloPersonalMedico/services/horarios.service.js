import httpClient from '../../../core/api/http-client'

/**
 * CU09 – Gestionar Horarios y Disponibilidad Médica.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/** @returns {Promise<{ medico: object, horarios: object[] }>} */
export async function obtenerHorarios(idMedico) {
  const respuesta = await httpClient.get(`/medicos/${idMedico}/horarios`)
  return respuesta.data
}

export async function crearHorario(idMedico, datos) {
  return httpClient.post(`/medicos/${idMedico}/horarios`, datos)
}

export async function actualizarHorario(idMedico, idHorario, datos) {
  return httpClient.put(`/medicos/${idMedico}/horarios/${idHorario}`, datos)
}

export async function eliminarHorario(idMedico, idHorario) {
  return httpClient.delete(`/medicos/${idMedico}/horarios/${idHorario}`)
}

/**
 * @param {string} fecha  'AAAA-MM-DD'
 * @returns {Promise<{ fecha: string, medico_activo: boolean, turnos: { hora_inicio: string, hora_fin: string, estado: string }[], resumen: object }>}
 */
export async function obtenerDisponibilidad(idMedico, fecha) {
  const respuesta = await httpClient.get(`/medicos/${idMedico}/disponibilidad`, { params: { fecha } })
  return respuesta.data
}
