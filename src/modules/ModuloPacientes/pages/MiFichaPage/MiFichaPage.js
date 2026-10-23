import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../core/api/error-handler'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { actualizarMiFicha, obtenerMiFicha } from '../../services/pacientes.service'
import { contactoParaEnviar, validarContacto } from '../../utils/validacionPaciente'

/**
 * Lógica de "Mi ficha médica" (CU11, flujo 6 / RN08): el paciente actualiza su
 * tipo de sangre y su contacto de emergencia.
 */
export function useMiFichaPage() {
  const { datos: ficha, cargando, error, recargar } = useConsulta(obtenerMiFicha)
  const [aviso, setAviso] = useAviso()

  return { ficha, cargando, error, aviso, alGuardar: (mensaje) => { setAviso(mensaje); recargar() } }
}

/**
 * Estado del formulario de la ficha, inicializado con los datos actuales.
 */
export function useFormularioFicha(ficha, onGuardado) {
  const [tipoSangre, setTipoSangre] = useState(ficha.tipo_sangre ?? '')
  const [contacto, setContacto] = useState(ficha.contacto)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cambiarTipoSangre(evento) {
    setTipoSangre(evento.target.value)
  }

  function cambiarContacto(nuevo) {
    setContacto(nuevo)
    setErrores({})
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validarContacto(contacto)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const respuesta = await actualizarMiFicha({ tipo_sangre: tipoSangre || null, contacto: contactoParaEnviar(contacto) })
      onGuardado(respuesta.message)
    } catch (err) {
      if (err.status === 422 && err.errors) setErrores(primerErrorPorCampo(err.errors))
      else setErrorGeneral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return { tipoSangre, contacto, errores, errorGeneral, enviando, cambiarTipoSangre, cambiarContacto, manejarEnvio }
}
