/**
 * Validaciones en el cliente de los datos de una cuenta (CU02, CU05, CU08).
 * El servidor vuelve a validar siempre; estas solo evitan envíos inútiles.
 */

export const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Política de contraseñas (CU02, RN02): 8 a 72 caracteres con letras y números. */
export const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/

/** Campos de datos personales vacíos para un formulario nuevo. */
export function datosPersonalesIniciales(usuario) {
  return {
    ci: usuario?.ci ?? '',
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',
    sexo: usuario?.sexo ?? '',
    contrasena: '',
    contrasena_confirmation: '',
  }
}

/**
 * @param {boolean} contrasenaObligatoria  true al registrar; al editar solo se valida si se escribió.
 */
export function validarDatosCuenta(valores, contrasenaObligatoria) {
  const errores = {}

  if (!valores.ci.trim()) errores.ci = 'El CI es obligatorio.'
  if (!valores.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!valores.apellido.trim()) errores.apellido = 'El apellido es obligatorio.'
  if (!PATRON_CORREO.test(valores.correo.trim())) errores.correo = 'Ingrese un correo electrónico válido.'

  if (contrasenaObligatoria || valores.contrasena) {
    if (!PATRON_CONTRASENA.test(valores.contrasena)) {
      errores.contrasena = 'Mínimo 8 caracteres, con letras y números.'
    } else if (valores.contrasena !== valores.contrasena_confirmation) {
      errores.contrasena_confirmation = 'La confirmación no coincide.'
    }
  }

  return errores
}

/**
 * Prepara los datos de la cuenta para la API: teléfono y sexo vacíos como null y,
 * si no se escribió contraseña (edición), se omite para conservar la actual.
 */
export function datosCuentaParaEnviar(valores) {
  const datos = { ...valores, telefono: valores.telefono.trim() || null, sexo: valores.sexo || null }

  if (!datos.contrasena) {
    delete datos.contrasena
    delete datos.contrasena_confirmation
  }

  return datos
}
