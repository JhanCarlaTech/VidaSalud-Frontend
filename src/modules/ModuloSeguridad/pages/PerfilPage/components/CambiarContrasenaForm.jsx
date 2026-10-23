import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { cambiarContrasena } from '../../../services/perfil.service'
import { PATRON_CONTRASENA } from '../../../utils/validacionCuenta'

const VALORES_INICIALES = { contrasena_actual: '', contrasena: '', contrasena_confirmation: '' }

function validar({ contrasena_actual, contrasena, contrasena_confirmation }) {
  const errores = {}

  if (!contrasena_actual) errores.contrasena_actual = 'Ingrese su contraseña actual.'

  if (!PATRON_CONTRASENA.test(contrasena)) errores.contrasena = 'Mínimo 8 caracteres, con letras y números.'
  else if (contrasena === contrasena_actual) errores.contrasena = 'La nueva contraseña debe ser distinta de la actual.'
  else if (contrasena !== contrasena_confirmation) errores.contrasena_confirmation = 'La confirmación no coincide.'

  return errores
}

/**
 * Cambio de la contraseña propia (CU05, flujo 3). Al terminar, el servidor
 * cierra las sesiones de los demás dispositivos (RN04).
 */
export function CambiarContrasenaForm({ onCambiada }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const respuesta = await cambiarContrasena(valores)
      setValores(VALORES_INICIALES)
      onCambiada(respuesta.message)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message) // Incluye el 429 por exceso de intentos (RN05).
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
        <p className="text-sm text-suave">Al cambiarla se cerrarán sus sesiones en otros dispositivos.</p>
      </div>

      {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

      <fieldset className="grid gap-4 sm:grid-cols-2" disabled={enviando}>
        <legend className="sr-only">Contraseña</legend>
        <div className="sm:col-span-2">
          <Input
            etiqueta="Contraseña actual"
            name="contrasena_actual"
            type="password"
            autoComplete="current-password"
            value={valores.contrasena_actual}
            onChange={manejarCambio}
            error={errores.contrasena_actual}
          />
        </div>
        <Input
          etiqueta="Nueva contraseña"
          name="contrasena"
          type="password"
          autoComplete="new-password"
          value={valores.contrasena}
          onChange={manejarCambio}
          error={errores.contrasena}
        />
        <Input
          etiqueta="Confirmar nueva contraseña"
          name="contrasena_confirmation"
          type="password"
          autoComplete="new-password"
          value={valores.contrasena_confirmation}
          onChange={manejarCambio}
          error={errores.contrasena_confirmation}
        />
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit" cargando={enviando}>
          Cambiar contraseña
        </Button>
      </div>
    </form>
  )
}
