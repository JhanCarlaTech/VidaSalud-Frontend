import httpClient from '../../../core/api/http-client'

/** Catálogo de permisos activos (CU03). */
export async function listarPermisos() {
  const respuesta = await httpClient.get('/permisos')
  return respuesta.data
}
