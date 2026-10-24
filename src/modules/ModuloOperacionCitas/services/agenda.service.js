import httpClient from '../../../core/api/http-client'

export async function obtenerAgenda(filtros = {}) {
  const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
  const respuesta = await httpClient.get('/agenda', { params })
  
  // Devolvemos todo el objeto data, que contiene { citas: [...] }
  return respuesta.data 
}