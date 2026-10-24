import httpClient from '../../../core/api/http-client'
/**
 * CU24 – Gestionar Pasarela de Pago.
 */
export function registrarPago(datos) {
  return httpClient.post('/pagos', datos)
}