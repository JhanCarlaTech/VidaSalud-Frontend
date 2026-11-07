import httpClient from '../../../core/api/http-client'

/**
 * CU24 – Gestionar Pasarela de Pago.
 * Pagos sin pasarela en línea (QR, transferencia, efectivo): el paciente solo
 * deja constancia y queda 'Pendiente'; el personal registra pagos verificados.
 */
export function registrarPago(datos) {
  return httpClient.post('/pagos', datos)
}

/** @returns {Promise<{ id: number, nombre: string, descripcion: string|null, en_linea: boolean }[]>} */
export async function listarMetodosPago() {
  const respuesta = await httpClient.get('/metodos-pago')
  return respuesta.data
}

/**
 * Lo necesario para pagar una cita desde "Mis citas".
 * @returns {Promise<{ pago: object|null, cobrable: boolean, especialidades: { id: number, nombre: string, precio_consulta: number }[] }>}
 */
export async function obtenerPagoCita(idCita) {
  const respuesta = await httpClient.get(`/citas/${idCita}/pago`)
  return respuesta.data
}

/* ── Pago con tarjeta (Stripe) ─────────────────────────────────────────── */

/** @returns {Promise<{ habilitado: boolean, clave_publica: string|null, moneda: string }>} */
export async function obtenerConfiguracionStripe() {
  const respuesta = await httpClient.get('/pagos/stripe/configuracion')
  return respuesta.data
}

/**
 * Prepara el cobro: el servidor fija el monto con el precio de la especialidad.
 * client_secret es null si la cita ya estaba pagada.
 * @returns {Promise<{ pago: object, client_secret: string|null }>}
 */
export async function iniciarPagoEnLinea(idCita, idEspecialidad) {
  const respuesta = await httpClient.post(`/citas/${idCita}/pago-en-linea`, { id_especialidad: idEspecialidad })
  return respuesta.data
}

/** El servidor consulta a Stripe y devuelve el pago con su estado real. */
export async function confirmarPagoEnLinea(idCita) {
  const respuesta = await httpClient.post(`/citas/${idCita}/pago-en-linea/confirmar`)
  return respuesta.data
}
