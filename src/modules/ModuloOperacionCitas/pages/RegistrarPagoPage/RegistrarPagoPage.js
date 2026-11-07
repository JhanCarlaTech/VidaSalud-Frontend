import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { listarMetodosPago, registrarPago } from '../../services/pago.service'

export function useRegistrarPagoPage() {
  // El pago con tarjeta se cobra en línea con Stripe; aquí solo los métodos que se verifican a mano.
  const { datos } = useConsulta(listarMetodosPago)
  const metodos = (datos ?? []).filter((metodo) => !metodo.en_linea)

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

  return { formData, handleChange, handleSubmit, guardando, error, aviso, metodos }
}