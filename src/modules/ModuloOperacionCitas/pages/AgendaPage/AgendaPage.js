import { useState } from 'react'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { fechaISO } from '../../../../shared/utils/formatters'
import { obtenerAgenda } from '../../services/agenda.service'

export function useAgendaPage() {
  const [fecha, setFecha] = useState(fechaISO())
  const [idMedico, setIdMedico] = useState('')

  // 🔥 Usamos useConsulta igual que en AsistenciaPage
  const { datos, cargando, error: errorCarga, recargar } = useConsulta(
    () => obtenerAgenda({ fecha, id_medico: idMedico }),
    `${fecha}|${idMedico}`
  )

  return {
    fecha,
    idMedico,
    // datos contiene { citas: [...] }. Nos aseguramos de que siempre sea un array.
    citas: datos?.citas ?? [], 
    cargando,
    error: errorCarga,
    cambiarFecha: (nueva) => nueva && setFecha(nueva),
    cambiarMedico: (evento) => setIdMedico(evento.target.value),
    recargar,
  }
}