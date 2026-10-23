import { ETIQUETA_ROL } from './constants'

/** 'Medico' → 'Médico'. Los roles desconocidos se muestran tal cual. */
export function etiquetaRol(rol) {
  return ETIQUETA_ROL[rol] ?? rol
}

/** { nombre: 'Carlos', apellido: 'Mendoza' } → 'CM' */
export function iniciales({ nombre, apellido }) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

/** 'usuarios_gestionar' → 'Usuarios gestionar' */
export function formatearPermiso(accion) {
  const texto = accion.replaceAll('_', ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const FORMATO_MONEDA = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' })

/** 8500 | '8500.00' → 'Bs 8.500,00' */
export function formatearMoneda(valor) {
  return valor == null || valor === '' ? '—' : FORMATO_MONEDA.format(Number(valor))
}

const FORMATO_FECHA =new Intl.DateTimeFormat('es-BO', { dateStyle: 'long' })
const FORMATO_FECHA_HORA = new Intl.DateTimeFormat('es-BO', { dateStyle: 'medium', timeStyle: 'short' })

/** '2026-10-23T12:00:00-04:00' → '23 de octubre de 2026' */
export function formatearFecha(iso) {
  return iso ? FORMATO_FECHA.format(new Date(iso)) : '—'
}

/** '2026-10-23T12:00:00-04:00' → '23 oct 2026, 12:00' */
export function formatearFechaHora(iso) {
  return iso ? FORMATO_FECHA_HORA.format(new Date(iso)) : '—'
}

/** Fecha local en formato 'AAAA-MM-DD' (sin pasar por UTC), desplazada `dias` días. */
export function fechaISO(dias = 0, base = new Date()) {
  const fecha = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

/** '08:30' → 510 */
export function minutosDelDia(hora) {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

export function saludoSegunHora(hora = new Date().getHours()) {
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
