import httpClient from '../../../core/api/http-client'

/**
 * CU18 – Emitir Receta Médica.
 * Las consultas devuelven el campo `data`; la emisión devuelve la respuesta completa
 * `{ message, data }` para mostrar el mensaje del servidor.
 */

/**
 * Consultas atendidas por el médico autenticado, con cuántas recetas tiene cada una.
 * @returns {Promise<{ items: object[], meta: object, dias_para_emitir: number }>}
 */
export async function listarConsultasDelMedico({ buscar = '', page = 1 } = {}) {
  const params = { page, ...(buscar ? { buscar } : {}) }
  const respuesta = await httpClient.get('/recetas/consultas', { params })
  return respuesta.data
}

/** Recetas ya emitidas en una consulta (solo su médico). */
export async function listarRecetasDeConsulta(idConsulta) {
  const respuesta = await httpClient.get(`/consultas/${idConsulta}/recetas`)
  return respuesta.data
}

/**
 * @param {{ indicaciones_generales?: string, medicamentos: { medicamento: string, dosis: string, frecuencia: string, duracion_dias: number }[] }} datos
 */
export async function emitirReceta(idConsulta, datos) {
  return httpClient.post(`/consultas/${idConsulta}/recetas`, datos)
}

/**
 * "Mis recetas" del paciente autenticado, de la más reciente a la más antigua.
 * @returns {Promise<{ items: object[], meta: object }>}
 */
export async function listarMisRecetas({ buscar = '', page = 1 } = {}) {
  const params = { page, ...(buscar ? { buscar } : {}) }
  const respuesta = await httpClient.get('/mis-recetas', { params })
  return respuesta.data
}

/** Receta completa para verla o imprimirla (médico emisor o el propio paciente). */
export async function obtenerReceta(idReceta) {
  const respuesta = await httpClient.get(`/recetas/${idReceta}`)
  return respuesta.data
}
