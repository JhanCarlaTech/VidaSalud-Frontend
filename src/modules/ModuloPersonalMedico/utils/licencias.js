import { formatearDia } from '../../../shared/utils/formatters'

/**
 * Utilidades de las licencias (CU10). El servidor envía y recibe las fechas en la
 * hora de la clínica como 'AAAA-MM-DD HH:mm', así que aquí no se convierten zonas horarias.
 */

/** Horas con las que se guarda una licencia de días completos. */
export const INICIO_DEL_DIA = '00:00'
export const FIN_DEL_DIA = '23:59'

export const ETIQUETA_ESTADO = Object.freeze({
  vigente: 'En curso',
  proxima: 'Próxima',
  finalizada: 'Finalizada',
})

export const OPCIONES_PERIODO = Object.freeze([
  { valor: 'actuales', etiqueta: 'En curso y próximas' },
  { valor: 'vigentes', etiqueta: 'En curso' },
  { valor: 'proximas', etiqueta: 'Próximas' },
  { valor: 'finalizadas', etiqueta: 'Finalizadas' },
  { valor: 'todas', etiqueta: 'Todas' },
])

/** '2026-11-27 08:00' → { fecha: '2026-11-27', hora: '08:00' } */
export function separarFechaHora(valor) {
  const [fecha = '', hora = ''] = (valor ?? '').split(' ')
  return { fecha, hora }
}

const CORTA = { dateStyle: 'medium' }

/**
 * Periodo legible:
 * - días completos: '4 dic 2026 – 6 dic 2026' (o un solo día);
 * - mismo día: '27 nov 2026, 08:00 – 10:00';
 * - varios días: '5 nov 2026, 00:00 – 6 nov 2026, 09:00'.
 */
export function describirPeriodo({ fecha_inicio, fecha_fin, dias_completos }) {
  const inicio = separarFechaHora(fecha_inicio)
  const fin = separarFechaHora(fecha_fin)

  if (dias_completos) {
    return inicio.fecha === fin.fecha
      ? `${formatearDia(inicio.fecha, CORTA)} (todo el día)`
      : `${formatearDia(inicio.fecha, CORTA)} – ${formatearDia(fin.fecha, CORTA)}`
  }

  if (inicio.fecha === fin.fecha) return `${formatearDia(inicio.fecha, CORTA)}, ${inicio.hora} – ${fin.hora}`

  return `${formatearDia(inicio.fecha, CORTA)}, ${inicio.hora} – ${formatearDia(fin.fecha, CORTA)}, ${fin.hora}`
}
