/**
 * Normalización de los errores de la API de Laravel.
 * El backend responde con { success: false, message, errors }.
 */

/** Error de la API con el formato { status, message, errors }. */
export class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

function mensajeDeError(status, body) {
  if (status === 0) return 'No se pudo conectar con el servidor. Verifique su conexión.'
  if (status === 419) return 'La verificación de seguridad expiró. Recargue la página e intente de nuevo.'
  return body?.message ?? 'Ocurrió un error inesperado. Intente nuevamente.'
}

/** Convierte un error de Axios en un ApiError con un mensaje apto para el usuario. */
export function normalizarError(error) {
  const status = error.response?.status ?? 0
  const body = error.response?.data

  return new ApiError(status, mensajeDeError(status, body), body?.errors ?? null)
}

/**
 * Convierte { campo: [mensajes] } de Laravel en { campo: primerMensaje }.
 * Los errores de elementos de arreglos ('roles.0', 'especialidades.1') se agrupan
 * en su campo base; los campos de objetos ('contacto.nombre') se conservan.
 */
export function primerErrorPorCampo(errores) {
  const porCampo = {}

  for (const [clave, mensajes] of Object.entries(errores)) {
    const campo = clave.replace(/\.\d+(\..*)?$/, '')
    porCampo[campo] ??= mensajes[0]
  }

  return porCampo
}
