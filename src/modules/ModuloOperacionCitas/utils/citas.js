import { DIAS_SEMANA } from '../../../shared/utils/constants'
import { fechaISO } from '../../../shared/utils/formatters'

/** Estados posibles de una cita ('estado_cita_enum'; 'En Sala de Espera' se agregó en CU15). */
export const ESTADOS_CITA = Object.freeze(['Programada', 'Confirmada', 'En Sala de Espera', 'Atendida', 'Cancelada', 'Inasistencia'])

/**
 * Texto del botón para una transición de asistencia (CU15), según el estado actual:
 * la misma transición puede ser una acción normal o una corrección.
 */
export function etiquetaAccionAsistencia(estadoActual, destino) {
  if (destino === 'Confirmada') return estadoActual === 'En Sala de Espera' ? 'Deshacer llegada' : 'Confirmar'
  if (destino === 'En Sala de Espera') return estadoActual === 'Inasistencia' ? 'Llegó tarde' : 'Registrar llegada'
  if (destino === 'Inasistencia') return 'No asistió'
  return destino
}

/** CU14 RN02: anticipación mínima con la que el paciente puede modificar su cita. */
export const HORAS_MINIMAS_PACIENTE = 2

/**
 * ¿Se puede reprogramar o cancelar la cita? (CU14 RN01 y RN02).
 * El servidor vuelve a verificarlo; aquí solo decide qué acciones mostrar.
 * @returns {{ permitido: boolean, motivo: string | null }}
 */
export function puedeModificar(cita, esPersonal, ahora = new Date()) {
  const inicio = new Date(cita.inicio)

  if (!cita.pendiente || inicio <= ahora) return { permitido: false, motivo: null }

  if (!esPersonal && inicio - ahora < HORAS_MINIMAS_PACIENTE * 60 * 60 * 1000) {
    return { permitido: false, motivo: `Faltan menos de ${HORAS_MINIMAS_PACIENTE} horas: para cambios, comuníquese con recepción.` }
  }

  return { permitido: true, motivo: null }
}

/** Variante visual del estado de una cita ('estado_cita_enum'). */
export const VARIANTE_ESTADO_CITA = Object.freeze({
  Programada: 'neutro',
  Confirmada: 'neutro',
  'En Sala de Espera': 'solido',
  Atendida: 'contorno',
  Cancelada: 'contorno',
  Inasistencia: 'contorno',
})

/** Día de la semana ISO (1 = lunes … 7 = domingo) de una fecha 'AAAA-MM-DD'. */
export function diaSemanaISO(fecha) {
  return new Date(`${fecha}T00:00`).getDay() || 7
}

/** [1, 3] → 'Lunes y Miércoles' */
export function describirDias(dias) {
  const nombres = dias.map((dia) => DIAS_SEMANA.find((d) => d.valor === dia)?.etiqueta).filter(Boolean)
  if (nombres.length <= 1) return nombres[0] ?? 'Sin días de atención'
  return `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
}

/**
 * Próximas fechas (desde hoy, hasta `alcance` días) que caen en los días de atención del médico.
 * @returns {string[]}  Fechas 'AAAA-MM-DD'.
 */
export function proximasFechasDeAtencion(diasAtencion, cantidad = 6, alcance = 90) {
  const fechas = []

  for (let desplazamiento = 0; desplazamiento <= alcance && fechas.length < cantidad; desplazamiento++) {
    const fecha = fechaISO(desplazamiento)
    if (diasAtencion.includes(diaSemanaISO(fecha))) fechas.push(fecha)
  }

  return fechas
}

const FORMATO_FECHA_CORTA = new Intl.DateTimeFormat('es-BO', { weekday: 'short', day: 'numeric', month: 'short' })
const FORMATO_FECHA_LARGA = new Intl.DateTimeFormat('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** '2026-10-27' → 'mar, 27 oct' */
export function fechaCorta(fecha) {
  return FORMATO_FECHA_CORTA.format(new Date(`${fecha}T00:00`))
}

/** '2026-10-27' → 'martes, 27 de octubre de 2026' */
export function fechaLarga(fecha) {
  return FORMATO_FECHA_LARGA.format(new Date(`${fecha}T00:00`))
}
