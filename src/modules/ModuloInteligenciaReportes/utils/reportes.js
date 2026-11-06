import { fechaISO, formatearDia, formatearMoneda } from '../../../shared/utils/formatters'

const NUMERO = new Intl.NumberFormat('es-BO')
const PORCENTAJE = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 })
const MES = new Intl.DateTimeFormat('es-BO', { month: 'long', year: 'numeric' })

/**
 * Valor de una celda del reporte según el formato que indica el servidor (CU21).
 * @param {'numero'|'moneda'|'porcentaje'|'fecha'|'mes'|'texto'} formato
 */
export function formatearValor(valor, formato) {
  if (valor === null || valor === undefined || valor === '') return '—'

  switch (formato) {
    case 'numero':
      return NUMERO.format(Number(valor))
    case 'moneda':
      return formatearMoneda(valor)
    case 'porcentaje':
      return `${PORCENTAJE.format(Number(valor))} %`
    case 'fecha':
      return /^\d{4}-\d{2}-\d{2}$/.test(valor) ? formatearDia(valor, { dateStyle: 'medium' }) : String(valor)
    case 'mes':
      // '2026-10' → 'octubre de 2026' (día 15 para que la zona horaria no cambie el mes).
      return /^\d{4}-\d{2}$/.test(valor) ? MES.format(new Date(`${valor}-15T12:00:00`)) : String(valor)
    default:
      return String(valor)
  }
}

/** Las columnas numéricas se alinean a la derecha. */
export const esNumerica = (formato) => ['numero', 'moneda', 'porcentaje'].includes(formato)

/** Primer y último día del mes de la fecha dada, como 'AAAA-MM-DD'. */
function limitesDelMes(anio, mes) {
  const dosDigitos = (n) => String(n).padStart(2, '0')
  const ultimo = new Date(anio, mes + 1, 0).getDate()
  return { desde: `${anio}-${dosDigitos(mes + 1)}-01`, hasta: `${anio}-${dosDigitos(mes + 1)}-${dosDigitos(ultimo)}` }
}

/** Atajos de periodo para el formulario de filtros. */
export function periodosRapidos(hoy = new Date()) {
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth()

  return [
    { etiqueta: 'Este mes', ...limitesDelMes(anio, mes) },
    { etiqueta: 'Mes anterior', ...limitesDelMes(mes === 0 ? anio - 1 : anio, mes === 0 ? 11 : mes - 1) },
    { etiqueta: 'Últimos 30 días', desde: fechaISO(-29, hoy), hasta: fechaISO(0, hoy) },
    { etiqueta: 'Este año', desde: `${anio}-01-01`, hasta: `${anio}-12-31` },
  ]
}
