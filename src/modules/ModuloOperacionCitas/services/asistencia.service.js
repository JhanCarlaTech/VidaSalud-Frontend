import httpClient from '../../../core/api/http-client'

/**
 * CU15 – Registrar Control de Asistencia.
 */

/**
 * Citas de una fecha con su resumen por estado y las acciones permitidas en cada una.
 * @param {{ fecha?: string, buscar?: string }} filtros
 * @returns {Promise<{ fecha: string, resumen: Object<string, number>, citas: object[] }>}
 */
export async function obtenerAsistencia(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/asistencia', { params })
  return respuesta.data
}

/**
 * @param {'Confirmada' | 'En Sala de Espera' | 'Inasistencia'} estado
 * @returns {Promise<{ message: string, data: object }>}
 */
export async function registrarAsistencia(idCita, estado) {
  return httpClient.patch(`/citas/${idCita}/asistencia`, { estado })
}
