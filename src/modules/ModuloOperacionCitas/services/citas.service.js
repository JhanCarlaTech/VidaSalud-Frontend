import httpClient from '../../../core/api/http-client'

/**
 * CU13 – Gestionar Citas Médicas y Modalidad.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/** @returns {Promise<{ id: number, nombre: string }[]>} */
export async function listarModalidades() {
  const respuesta = await httpClient.get('/modalidades')
  return respuesta.data
}

/**
 * Médicos activos de una especialidad, con sus días de atención (1 = lunes).
 * @returns {Promise<{ id: number, codigo: string, nombre_completo: string, especialidades: string[], dias_atencion: number[] }[]>}
 */
export async function listarDirectorioMedico(idEspecialidad) {
  const respuesta = await httpClient.get('/medicos/directorio', { params: { especialidad: idEspecialidad } })
  return respuesta.data
}

/**
 * @param {{ id_paciente?: number, id_especialidad: number, id_medico: number, id_modalidad: number, fecha: string, hra_inicio: string, motivo: string }} datos
 */
export async function agendarCita(datos) {
  return httpClient.post('/citas', datos)
}

/**
 * CU14 – Búsqueda de citas para el personal.
 * @param {{ buscar?: string, estado?: string, fecha?: string, periodo?: 'proximas'|'historial'|'todas', page?: number }} filtros
 * @returns {Promise<{ items: object[], meta: object }>}
 */
export async function listarCitas(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/citas', { params })
  return respuesta.data
}

/** CU14 – @param {{ fecha: string, hra_inicio: string, id_modalidad?: number }} datos */
export async function reprogramarCita(id, datos) {
  return httpClient.patch(`/citas/${id}/reprogramar`, datos)
}

/** CU14 */
export async function cancelarCita(id, motivoCancelacion) {
  return httpClient.patch(`/citas/${id}/cancelar`, { motivo_cancelacion: motivoCancelacion })
}

/** @param {'proximas' | 'historial'} periodo */
export async function listarMisCitas(periodo) {
  const respuesta = await httpClient.get('/mis-citas', { params: { periodo } })
  return respuesta.data
}
