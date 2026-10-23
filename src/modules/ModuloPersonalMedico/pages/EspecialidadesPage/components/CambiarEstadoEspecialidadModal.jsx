import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { cambiarEstadoEspecialidad } from '../../../services/especialidades.service'

/**
 * Confirmación para activar o desactivar una especialidad (CU07, flujo 4 / RN03–RN04).
 */
export function CambiarEstadoEspecialidadModal({ especialidad, onCerrar, onCambiado }) {
  const desactivar = especialidad.activo
  const cantidad = especialidad.medicos_activos
  const medicos = cantidad === 1 ? '1 médico activo la ejerce' : `${cantidad} médicos activos la ejercen`

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar especialidad' : 'Activar especialidad'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoEspecialidad(especialidad.id, !especialidad.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        <strong className="font-semibold">{especialidad.nombre}</strong>{' '}
        {desactivar
          ? 'dejará de ofrecerse al asignar especialidades a los médicos y al reservar citas.'
          : 'volverá a ofrecerse al asignar especialidades y al reservar citas.'}
      </p>
      {desactivar && cantidad > 0 && (
        <p className="text-suave">Actualmente {medicos}. Conservarán la especialidad en su ficha.</p>
      )}
    </ConfirmModal>
  )
}
