import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { registrarConsulta } from '../../services/consulta.service'

export function useRegistrarConsultaPage() {
  // Estado inicial del formulario (todos los campos que espera el backend)
  const [formData, setFormData] = useState({
    id_cita_medica: '',
    motivo_de_consultas: '',
    peso: '',
    estatura: '',
    escala_del_dolor: '',
    sintomas: '',
    tratamiento: ''
  })
  
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useAviso()

  // Manejador genérico para todos los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const respuesta = await registrarConsulta(formData)
      setAviso(respuesta.message || 'Consulta médica registrada correctamente.')
      
      // Limpiamos el formulario tras el éxito
      setFormData({
        id_cita_medica: '',
        motivo_de_consultas: '',
        peso: '',
        estatura: '',
        escala_del_dolor: '',
        sintomas: '',
        tratamiento: ''
      })
    } catch (err) {
      // Capturamos el error 422 de Laravel (validaciones)
      if (err.errors) {
        const primerError = Object.values(err.errors)[0][0]
        setError(primerError)
      } else {
        setError(err.message || 'Error al registrar la consulta.')
      }
    } finally {
      setGuardando(false)
    }
  }

  return { formData, handleChange, handleSubmit, guardando, error, aviso }
}