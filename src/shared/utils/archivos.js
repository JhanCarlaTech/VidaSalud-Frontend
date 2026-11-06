/**
 * Utilidades para descargar archivos generados en el navegador.
 */

/** Descarga un Blob con el nombre indicado. */
export function descargarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.append(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)
}

/** Encierra el valor entre comillas si contiene el separador, comillas o saltos de línea. */
function celdaCsv(valor) {
  const texto = String(valor ?? '')
  return /[;"\r\n]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto
}

/**
 * CSV compatible con Excel en español: separador ';' y BOM para que respete tildes y ñ.
 * @param {string[]} encabezados
 * @param {(string | number | null)[][]} filas
 * @returns {Blob}
 */
export function crearCsv(encabezados, filas) {
  const lineas = [encabezados, ...filas].map((fila) => fila.map(celdaCsv).join(';'))
  return new Blob(['﻿', lineas.join('\r\n')], { type: 'text/csv;charset=utf-8' })
}

/** Tamaño legible: 1536 → '1,5 KB'. */
export function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('es-BO', { maximumFractionDigits: 1 })} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString('es-BO', { maximumFractionDigits: 1 })} MB`
}
