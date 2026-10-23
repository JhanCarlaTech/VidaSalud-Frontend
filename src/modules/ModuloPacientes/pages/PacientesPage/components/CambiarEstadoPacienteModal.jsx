import { Alert } from '../../../../../shared/components/ui/Alert'
import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { cambiarEstadoPaciente } from '../../../services/pacientes.service'

/**
 * Confirmación para activar o desactivar a un paciente (CU11, flujo 4 / RN09).
 */
export function CambiarEstadoPacienteModal({ paciente, onCerrar, onCambiado }) {
  const desactivar = paciente.activo
  const pendientes = paciente.citas_pendientes ?? 0

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar paciente' : 'Activar paciente'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoPaciente(paciente.id, !paciente.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        <strong className="font-semibold">{paciente.usuario.nombre_completo}</strong> ({paciente.codigo}){' '}
        {desactivar
          ? 'no podrá ingresar como paciente ni reservar citas. Su historial se conserva.'
          : 'podrá volver a ingresar y reservar citas.'}
      </p>
      {desactivar && pendientes > 0 && (
        <Alert variante="error">
          Tiene {pendientes === 1 ? '1 cita pendiente' : `${pendientes} citas pendientes`}. Deberá reprogramarlas o cancelarlas
          antes de desactivarlo.
        </Alert>
      )}
    </ConfirmModal>
  )
}
