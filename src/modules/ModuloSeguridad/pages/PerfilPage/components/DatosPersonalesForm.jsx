import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Select } from '../../../../../shared/components/ui/Select'
import { OPCIONES_SEXO } from '../../../../../shared/utils/constants'
import { actualizarPerfil } from '../../../services/perfil.service'
import { PATRON_CORREO } from '../../../utils/validacionCuenta'

function validar(valores, cambiaCorreo) {
  const errores = {}

  if (!valores.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!valores.apellido.trim()) errores.apellido = 'El apellido es obligatorio.'
  if (!PATRON_CORREO.test(valores.correo.trim())) errores.correo = 'Ingrese un correo electrónico válido.'
  if (cambiaCorreo && !valores.contrasena_actual) errores.contrasena_actual = 'Confirme su contraseña actual para cambiar el correo.'

  return errores
}

/**
 * Edición de los datos personales propios (CU05, flujo 2). El CI no es editable (RN01)
 * y cambiar el correo exige la contraseña actual (RN02).
 */
export function DatosPersonalesForm({ usuario, onGuardado }) {
  const [valores, setValores] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    telefono: usuario.telefono ?? '',
    sexo: usuario.sexo ?? '',
    contrasena_actual: '',
  })
  const [correoGuardado, setCorreoGuardado] = useState(usuario.correo)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiaCorreo = valores.correo.trim().toLowerCase() !== correoGuardado

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, cambiaCorreo)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { ...valores, telefono: valores.telefono.trim() || null, sexo: valores.sexo || null }
    if (!cambiaCorreo) delete datos.contrasena_actual

    setEnviando(true)
    try {
      const respuesta = await actualizarPerfil(datos)
      setCorreoGuardado(respuesta.data.correo)
      setValores((actuales) => ({ ...actuales, correo: respuesta.data.correo, contrasena_actual: '' }))
      onGuardado(respuesta.message)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
      {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

      <fieldset className="grid gap-4 sm:grid-cols-2" disabled={enviando}>
        <legend className="sr-only">Datos personales</legend>
        <Input etiqueta="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} />
        <Input etiqueta="Apellido" name="apellido" value={valores.apellido} onChange={manejarCambio} error={errores.apellido} />
        <div className="flex flex-col gap-1">
          <Input etiqueta="CI" name="ci" value={usuario.ci} disabled readOnly />
          <p className="text-xs text-suave">Solo un administrador puede corregir el CI.</p>
        </div>
        <Input etiqueta="Teléfono (opcional)" name="telefono" type="tel" value={valores.telefono} onChange={manejarCambio} error={errores.telefono} />
        <div className="sm:col-span-2">
          <Input etiqueta="Correo electrónico" name="correo" type="email" autoComplete="email" value={valores.correo} onChange={manejarCambio} error={errores.correo} />
        </div>
        <Select etiqueta="Sexo" name="sexo" value={valores.sexo} onChange={manejarCambio} opciones={OPCIONES_SEXO} error={errores.sexo} />
      </fieldset>

      {cambiaCorreo && (
        <fieldset className="flex flex-col gap-3 rounded-sm border border-borde bg-superficie p-4" disabled={enviando}>
          <legend className="sr-only">Confirmación</legend>
          <p className="text-sm">El correo es su dato de inicio de sesión. Confirme su contraseña para cambiarlo.</p>
          <Input
            etiqueta="Contraseña actual"
            name="contrasena_actual"
            type="password"
            autoComplete="current-password"
            value={valores.contrasena_actual}
            onChange={manejarCambio}
            error={errores.contrasena_actual}
          />
        </fieldset>
      )}

      <div className="flex justify-end">
        <Button type="submit" cargando={enviando}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
