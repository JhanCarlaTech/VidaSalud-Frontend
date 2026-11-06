import httpClient from '../../../core/api/http-client'

/**
 * CU12 – Catálogo de enfermedades y antecedentes del paciente.
 * Las consultas devuelven el campo `data`; las operaciones de escritura devuelven
 * la respuesta completa `{ message, data }` para mostrar el mensaje del servidor.
 */

/** Omite los filtros vacíos para no enviarlos en la URL. */
function parametros(filtros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
}

// --- Catálogo ---------------------------------------------------------------

/** @param {{ buscar?: string, activo?: '1'|'0'|'', nivel_riesgo?: string }} filtros */
export async function listarEnfermedades(filtros = {}) {
  const respuesta = await httpClient.get('/enfermedades', { params: parametros(filtros) })
  return respuesta.data
}

export async function crearEnfermedad(datos) {
  return httpClient.post('/enfermedades', datos)
}

export async function actualizarEnfermedad(id, datos) {
  return httpClient.put(`/enfermedades/${id}`, datos)
}

export async function cambiarEstadoEnfermedad(id, activo) {
  return httpClient.patch(`/enfermedades/${id}/estado`, { activo })
}

// --- Antecedentes del paciente ----------------------------------------------

/** Pacientes por CI, código o nombre (mínimo 2 caracteres, hasta 10 resultados). */
export async function buscarPacientes(buscar) {
  const respuesta = await httpClient.get('/antecedentes/pacientes', { params: { buscar } })
  return respuesta.data
}

/** @returns {Promise<{ paciente: object, antecedentes: object[] }>} */
export async function obtenerAntecedentes(idPaciente) {
  const respuesta = await httpClient.get(`/pacientes/${idPaciente}/antecedentes`)
  return respuesta.data
}

export async function registrarAntecedente(idPaciente, datos) {
  return httpClient.post(`/pacientes/${idPaciente}/antecedentes`, datos)
}

/** La enfermedad no se cambia: va en la ruta. */
export async function actualizarAntecedente(idPaciente, idEnfermedad, datos) {
  return httpClient.put(`/pacientes/${idPaciente}/antecedentes/${idEnfermedad}`, datos)
}

export async function eliminarAntecedente(idPaciente, idEnfermedad) {
  return httpClient.delete(`/pacientes/${idPaciente}/antecedentes/${idEnfermedad}`)
}
