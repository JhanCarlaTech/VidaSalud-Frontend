import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { primerErrorPorCampo } from '../../../../core/api/error-handler'
import { useAuth } from '../../hooks/useAuth'

const VALORES_INICIALES = { correo: '', contrasena: '' }
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validación en el cliente (E1). El servidor vuelve a validar siempre. */
function validar({ correo, contrasena }) {
  const errores = {}

  if (!correo.trim()) errores.correo = 'El correo es obligatorio.'
  else if (!PATRON_CORREO.test(correo.trim())) errores.correo = 'Ingrese un correo electrónico válido.'

  if (!contrasena) errores.contrasena = 'La contraseña es obligatoria.'

  return errores
}

/**
 * Lógica de la página de login (CU01): estado del formulario, validación,
 * envío de credenciales y redirección al panel del rol.
 */
export function useLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [verContrasena, setVerContrasena] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function alternarVerContrasena() {
    setVerContrasena((visible) => !visible)
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const sesion = await login({ correo: valores.correo.trim(), contrasena: valores.contrasena })
      navigate(sesion.ruta_inicio, { replace: true })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        setErrores(primerErrorPorCampo(error.errors))
      } else {
        // 401, 403, 429 y 500: el servidor ya envía un mensaje seguro para mostrar.
        setErrorGeneral(error.message)
      }
      setValores((actuales) => ({ ...actuales, contrasena: '' }))
      setEnviando(false)
    }
  }

  return {
    valores,
    errores,
    errorGeneral,
    enviando,
    verContrasena,
    manejarCambio,
    alternarVerContrasena,
    manejarEnvio,
  }
}
