import httpClient from '../../../core/api/http-client'

/**
 * CU21 – Generar Reportes Operativos Tradicionales (también lo usará CU22).
 *
 * @typedef {{ clave: string, etiqueta: string, formato: 'numero'|'moneda'|'porcentaje'|'fecha'|'mes'|'texto' }} Columna
 * @typedef {{ tipo: string, titulo: string, descripcion: string, periodo: { desde: string, hasta: string },
 *   filtros_aplicados: { etiqueta: string, valor: string }[], resumen: (Columna & { valor: number|null })[],
 *   agrupado: { por: string, etiqueta: string, columnas: Columna[], filas: object[] },
 *   detalle: { columnas: Columna[], filas: object[], total: number, truncado: boolean }, alcance: 'clinica'|'personal', generado_en: string }} Reporte
 */

/** Omite los filtros vacíos para no enviarlos en la URL. */
export function parametrosReporte(filtros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor != null))
}

/** Reportes disponibles para el usuario, opciones de los filtros y su alcance. */
export async function obtenerCatalogoReportes() {
  const respuesta = await httpClient.get('/reportes/catalogo')
  return respuesta.data
}

/** @returns {Promise<Reporte>} */
export async function generarReporte(tipo, filtros) {
  const respuesta = await httpClient.get(`/reportes/${tipo}`, { params: parametrosReporte(filtros) })
  return respuesta.data
}

/**
 * CSV de la tabla agrupada o del detalle completo.
 * @param {'agrupado' | 'detalle'} seccion
 * @returns {Promise<Blob>}
 */
export async function exportarReporte(tipo, filtros, seccion) {
  return httpClient.get(`/reportes/${tipo}/exportar`, { params: { ...parametrosReporte(filtros), seccion }, responseType: 'blob' })
}
