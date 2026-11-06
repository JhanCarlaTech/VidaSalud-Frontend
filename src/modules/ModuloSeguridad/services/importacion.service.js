import httpClient from '../../../core/api/http-client'

/**
 * CU04 – Cargar Usuarios por Lotes.
 * `tipo` es 'personal' (administradores y recepcionistas) o 'pacientes'.
 */

/** Arma el cuerpo multipart con el tipo de carga y el archivo CSV. */
function formulario(tipo, archivo) {
  const datos = new FormData()
  datos.append('tipo', tipo)
  datos.append('archivo', archivo)
  return datos
}

/**
 * Plantilla CSV con los encabezados y una fila de ejemplo.
 * @returns {Promise<Blob>}
 */
export async function descargarPlantilla(tipo) {
  return httpClient.get('/importaciones/plantilla', { params: { tipo }, responseType: 'blob' })
}

/**
 * Vista previa sin guardar nada: datos normalizados y errores por fila.
 * @returns {Promise<{ tipo: string, resumen: { total: number, validas: number, con_errores: number },
 *   filas: { fila: number, datos: object, errores: Record<string, string> }[] }>}
 */
export async function validarImportacion(tipo, archivo) {
  const respuesta = await httpClient.post('/importaciones/validar', formulario(tipo, archivo))
  return respuesta.data
}

/**
 * Crea todas las cuentas del archivo o ninguna. Devuelve la respuesta completa
 * `{ message, data: { tipo, creados, credenciales } }`.
 */
export async function importarArchivo(tipo, archivo) {
  return httpClient.post('/importaciones', formulario(tipo, archivo))
}
