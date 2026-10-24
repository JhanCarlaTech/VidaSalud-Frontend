import httpClient from '../../../core/api/http-client'
/**
 * CU17 – Registrar Consulta Médica.
 */
export function registrarConsulta(datos) {
  return httpClient.post('/consultas', datos)
}