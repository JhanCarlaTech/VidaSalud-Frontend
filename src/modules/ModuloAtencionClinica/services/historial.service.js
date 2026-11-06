import httpClient from '../../../core/api/http-client'

/**
 * CU19 – Consultar Historial Clínico del Paciente.
 * Cada apertura del historial (página 1) queda registrada en la bitácora.
 *
 * @typedef {{ paciente: object, resumen: object, antecedentes: object[], consultas: { items: object[], meta: object } }} Historial
 */

/** Pacientes que atiende el médico autenticado. */
export async function listarMisPacientes({ buscar = '', page = 1 } = {}) {
  const params = { page, ...(buscar ? { buscar } : {}) }
  const respuesta = await httpClient.get('/historial/pacientes', { params })
  return respuesta.data
}

/** @returns {Promise<Historial>} */
export async function obtenerHistorial(idPaciente, page = 1) {
  const respuesta = await httpClient.get(`/pacientes/${idPaciente}/historial`, { params: { page } })
  return respuesta.data
}

/** Historial del propio paciente. @returns {Promise<Historial>} */
export async function obtenerMiHistorial(page = 1) {
  const respuesta = await httpClient.get('/mi-historial', { params: { page } })
  return respuesta.data
}
