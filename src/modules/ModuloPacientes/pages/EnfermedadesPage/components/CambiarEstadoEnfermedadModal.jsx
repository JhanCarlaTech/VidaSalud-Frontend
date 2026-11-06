import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { cambiarEstadoEnfermedad } from '../../../services/enfermedades.service'

/**
 * Confirmación para activar o desactivar una enfermedad (CU12, RN03: sin borrado físico).
 */
export function CambiarEstadoEnfermedadModal({ enfermedad, onCerrar, onCambiado }) {
  const desactivar = enfermedad.activo
  const cantidad = enfermedad.pacientes

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar enfermedad' : 'Activar enfermedad'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoEnfermedad(enfermedad.id, !enfermedad.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        <strong className="font-semibold">{enfermedad.nombre}</strong>{' '}
        {desactivar
          ? 'dejará de ofrecerse al registrar antecedentes nuevos.'
          : 'volverá a ofrecerse al registrar antecedentes.'}
      </p>
      {desactivar && cantidad > 0 && (
        <p className="text-suave">
          {cantidad === 1 ? '1 paciente la tiene' : `${cantidad} pacientes la tienen`} como antecedente y la conservará
          {cantidad === 1 ? '' : 'n'} en su ficha.
        </p>
      )}
    </ConfirmModal>
  )
}
