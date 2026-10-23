import { Alert } from '../../../../../shared/components/ui/Alert'
import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { cambiarEstadoMedico } from '../../../services/medicos.service'

/**
 * Confirmación para activar o desactivar a un médico (CU08, flujo 4 / RN06–RN07).
 */
export function CambiarEstadoMedicoModal({ medico, onCerrar, onCambiado }) {
  const desactivar = medico.activo
  const pendientes = medico.citas_pendientes ?? 0

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar médico' : 'Activar médico'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoMedico(medico.id, !medico.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        <strong className="font-semibold">{medico.usuario.nombre_completo}</strong> ({medico.codigo}){' '}
        {desactivar
          ? 'no podrá ingresar como médico ni recibir nuevas citas. Si no tiene otro rol, se cerrarán sus sesiones.'
          : 'podrá volver a ingresar como médico y recibir citas.'}
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
