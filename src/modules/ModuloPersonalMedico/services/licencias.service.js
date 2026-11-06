import httpClient from '../../../core/api/http-client'

/**
 * CU10 – Gestionar Licencias y Bloqueos de Agenda.
 * Las fechas viajan en la hora de la clínica con el formato 'AAAA-MM-DD HH:mm'.
 * El Médico solo ve y gestiona las suyas: el servidor ignora el médico que pida.
 */

/**
 * @param {{ medico?: number|string, periodo?: 'actuales'|'vigentes'|'proximas'|'finalizadas'|'todas', page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: object }>}
 */
export async function listarLicencias(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/licencias', { params })
  return respuesta.data
}

/** Médicos para los selectores (solo Administrador). */
export async function listarMedicosLicencias() {
  const respuesta = await httpClient.get('/licencias/medicos')
  return respuesta.data
}

/**
 * Citas pendientes que quedarían dentro del periodo, antes de guardar.
 * @param {{ id_medico?: number, fecha_inicio: string, fecha_fin: string }} periodo
 */
export async function obtenerCitasAfectadas(periodo) {
  const respuesta = await httpClient.get('/licencias/citas-afectadas', { params: periodo })
  return respuesta.data
}

/** Citas pendientes que siguen dentro de una licencia registrada. */
export async function obtenerCitasDeLicencia(idLicencia) {
  const respuesta = await httpClient.get(`/licencias/${idLicencia}/citas`)
  return respuesta.data
}

/** @returns {Promise<{ message: string, data: { licencia: object, citas_afectadas: object[] } }>} */
export async function crearLicencia(datos) {
  return httpClient.post('/licencias', datos)
}

export async function actualizarLicencia(id, datos) {
  return httpClient.put(`/licencias/${id}`, datos)
}

export async function eliminarLicencia(id) {
  return httpClient.delete(`/licencias/${id}`)
}
