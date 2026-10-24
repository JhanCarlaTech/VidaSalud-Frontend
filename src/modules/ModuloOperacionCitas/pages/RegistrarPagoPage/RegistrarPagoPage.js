import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { registrarPago } from '../../services/pago.service'

export function useRegistrarPagoPage() {
  const [formData, setFormData] = useState({
    id_cita: '',
    id_metodo_pago: '1',
    monto: '',
    codigo_transaccion: ''
  })
  
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useAviso()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const payload = { ...formData }
      if (!payload.codigo_transaccion) delete payload.codigo_transaccion

      const respuesta = await registrarPago(payload)
      setAviso(respuesta.message || 'Pago registrado correctamente.')
      setFormData({ id_cita: '', id_metodo_pago: '1', monto: '', codigo_transaccion: '' })
    } catch (err) {
      setError(err.errors ? Object.values(err.errors)[0][0] : (err.message || 'Error al procesar el pago.'))
    } finally {
      setGuardando(false)
    }
  }

  return { formData, handleChange, handleSubmit, guardando, error, aviso }
}