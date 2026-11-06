import httpClient from '../../../core/api/http-client'

/**
 * CU23 – Visualizar Dashboard Administrativo.
 * @param {{ desde: string, hasta: string }} periodo
 */
export async function obtenerDashboard({ desde, hasta }) {
  const respuesta = await httpClient.get('/dashboard', { params: { desde, hasta } })
  return respuesta.data
}
