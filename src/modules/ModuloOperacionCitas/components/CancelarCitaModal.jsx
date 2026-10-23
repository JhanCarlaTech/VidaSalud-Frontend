import { useState } from 'react'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import { Textarea } from '../../../shared/components/ui/Textarea'
import { cancelarCita } from '../services/citas.service'
import { fechaLarga } from '../utils/citas'

const LARGO_MINIMO_MOTIVO = 5

/**
 * Cancelación de una cita con motivo obligatorio (CU14, flujo 3 / RN06).
 */
export function CancelarCitaModal({ cita, onCerrar, onCancelada }) {
  const [motivo, setMotivo] = useState('')

  // ConfirmModal muestra el mensaje de cualquier error lanzado aquí.
  function confirmar() {
    if (motivo.trim().length < LARGO_MINIMO_MOTIVO) {
      return Promise.reject(new Error(`Indique el motivo de la cancelación (al menos ${LARGO_MINIMO_MOTIVO} caracteres).`))
    }
    return cancelarCita(cita.id, motivo.trim())
  }

  return (
    <ConfirmModal
      titulo={`Cancelar cita ${cita.codigo}`}
      textoConfirmar="Cancelar cita"
      onConfirmar={confirmar}
      onExito={(respuesta) => onCancelada(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        Cita del <span className="font-semibold">{fechaLarga(cita.fecha)}</span> a las {cita.hora_inicio} con{' '}
        {cita.medico.nombre_completo}. El turno quedará libre para otros pacientes; la cita se conserva en el historial.
      </p>
      <Textarea
        etiqueta="Motivo de la cancelación"
        rows={3}
        maxLength={500}
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
        autoFocus
      />
    </ConfirmModal>
  )
}
