import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { cambiarEstadoUsuario } from '../../../services/usuario.service'

/**
 * Confirmación para activar o desactivar una cuenta (CU02, flujo 4).
 * Las reglas RN06/RN07 del servidor se muestran como error dentro del diálogo.
 */
export function CambiarEstadoModal({ usuario, onCerrar, onCambiado }) {
  const desactivar = usuario.activo

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar usuario' : 'Activar usuario'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoUsuario(usuario.id, !usuario.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message)}
      onCerrar={onCerrar}
    >
      <p>
        <strong className="font-semibold">{usuario.nombre_completo}</strong>{' '}
        {desactivar
          ? 'no podrá iniciar sesión y se cerrarán todas sus sesiones abiertas. Podrá reactivar la cuenta cuando lo necesite.'
          : 'podrá volver a iniciar sesión con su contraseña actual.'}
      </p>
    </ConfirmModal>
  )
}
