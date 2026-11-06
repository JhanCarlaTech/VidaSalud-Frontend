import httpClient from '../../../core/api/http-client'

/**
 * CU22 – Reportes por comando de voz. El texto ya transcrito en el navegador se envía al
 * servidor, que lo interpreta (IA o reglas), lo valida contra la lista blanca de CU21 y
 * devuelve el reporte con un resumen para leer en voz alta.
 *
 * @returns {Promise<{ entendido: boolean, consulta: string, interprete: 'ia'|'reglas', notas: string[],
 *   mensaje?: string, ejemplos?: string[], parametros?: object,
 *   reporte?: import('./reportes.service').Reporte, resumen_hablado?: string }>}
 */
export async function consultarPorVoz(consulta) {
  const respuesta = await httpClient.post('/reportes/voz', { consulta })
  return respuesta.data
}
