import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { primerErrorPorCampo } from '../../../../core/api/error-handler'
import { useAuth } from '../../../ModuloSeguridad/hooks/useAuth'
import {
  datosCuentaParaEnviar,
  datosPersonalesIniciales,
  validarDatosCuenta,
} from '../../../ModuloSeguridad/utils/validacionCuenta'
import { validarFechaNacimiento } from '../../utils/validacionPaciente'

/**
 * Lógica del autorregistro de pacientes (CU11, flujo 5 / RN07). Al terminar,
 * la sesión queda iniciada y se redirige al panel del paciente.
 * El tipo de sangre y el contacto de emergencia se completan luego en "Mi ficha médica".
 */
export function useRegistroPage() {
  const { registrarse } = useAuth()
  const navigate = useNavigate()
  const [valores, setValores] = useState(() => ({ ...datosPersonalesIniciales(null), fecha_nacimiento: '' }))
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

    const erroresLocales = validarDatosCuenta(valores, true)
    const errorFecha = validarFechaNacimiento(valores.fecha_nacimiento)
    if (errorFecha) erroresLocales.fecha_nacimiento = errorFecha

    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const respuesta = await registrarse(datosCuentaParaEnviar(valores))
      navigate(respuesta.data.ruta_inicio, { replace: true })
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message) // Incluye el 429 por exceso de intentos (E4).
      setEnviando(false)
    }
  }

  return { valores, errores, errorGeneral, enviando, manejarCambio, manejarEnvio }
}
