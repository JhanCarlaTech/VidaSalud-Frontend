import httpClient from '../../../core/api/http-client'
/**
 * CU24 – Gestionar Pasarela de Pago.
 */
export function registrarPago(datos) {
  return httpClient.post('/pagos', datos)
}

/** @returns {Promise<{ id: number, nombre: string, descripcion: string|null }[]>} */
export async function listarMetodosPago() {
  const respuesta = await httpClient.get('/metodos-pago')
  return respuesta.data
}
