/**
 * Validaciones en el cliente de la ficha del paciente (CU11).
 * El servidor vuelve a validar siempre.
 */

/** Grupos sanguíneos admitidos (RN04). */
export const OPCIONES_TIPO_SANGRE = Object.freeze([
  { valor: '', etiqueta: 'No sabe / sin especificar' },
  ...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((tipo) => ({ valor: tipo, etiqueta: tipo })),
])

/** Sugerencias de parentesco (el campo admite cualquier texto). */
export const PARENTESCOS_SUGERIDOS = Object.freeze(['Madre', 'Padre', 'Esposa', 'Esposo', 'Hija', 'Hijo', 'Hermana', 'Hermano', 'Tutor'])

const PATRON_TELEFONO = /^[0-9+\-\s]{6,20}$/

export const CONTACTO_VACIO = Object.freeze({ nombre: '', apellido: '', parentesco: '', telefono: '' })

/** Fecha de nacimiento (RN03): anterior a hoy y posterior a 1900. */
export function validarFechaNacimiento(fecha) {
  if (!fecha) return 'La fecha de nacimiento es obligatoria.'
  if (fecha <= '1900-01-01') return 'La fecha de nacimiento no es válida.'
  if (new Date(`${fecha}T00:00`) >= new Date(new Date().toDateString())) return 'La fecha de nacimiento debe ser anterior a hoy.'
  return null
}

/**
 * Contacto de emergencia (RN05): si se registra, todos sus campos son obligatorios.
 * @param {object | null} contacto  null cuando no se registra contacto.
 * @returns {object}  Errores con claves 'contacto.nombre', 'contacto.telefono', etc.
 */
export function validarContacto(contacto) {
  if (contacto === null) return {}

  const errores = {}
  if (!contacto.nombre.trim()) errores['contacto.nombre'] = 'Ingrese el nombre del contacto.'
  if (!contacto.apellido.trim()) errores['contacto.apellido'] = 'Ingrese el apellido del contacto.'
  if (!contacto.parentesco.trim()) errores['contacto.parentesco'] = 'Indique el parentesco.'
  if (!PATRON_TELEFONO.test(contacto.telefono.trim())) errores['contacto.telefono'] = 'Ingrese un teléfono válido (6 a 20 dígitos).'

  return errores
}

/** Contacto listo para la API (campos recortados) o null. */
export function contactoParaEnviar(contacto) {
  if (contacto === null) return null
  return Object.fromEntries(Object.entries(contacto).map(([campo, valor]) => [campo, valor.trim()]))
}
