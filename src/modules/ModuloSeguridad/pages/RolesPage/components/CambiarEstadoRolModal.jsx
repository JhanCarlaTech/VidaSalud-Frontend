import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { etiquetaRol } from '../../../../../shared/utils/formatters'
import { cambiarEstadoRol } from '../../../services/rol.service'

/**
 * Confirmación para activar o desactivar un rol (CU03, flujo 4).
 */
export function CambiarEstadoRolModal({ rol, onCerrar, onCambiado }) {
  const desactivar = rol.activo
  const usuarios = rol.usuarios_count === 1 ? '1 usuario tiene' : `${rol.usuarios_count} usuarios tienen`

  return (
    <ConfirmModal
      titulo={desactivar ? 'Desactivar rol' : 'Activar rol'}
      textoConfirmar={desactivar ? 'Desactivar' : 'Activar'}
      onConfirmar={() => cambiarEstadoRol(rol.id, !rol.activo)}
      onExito={(respuesta) => onCambiado(respuesta.message, rol)}
      onCerrar={onCerrar}
    >
      <p>
        El rol <strong className="font-semibold">{etiquetaRol(rol.nombre)}</strong>{' '}
        {desactivar
          ? 'dejará de otorgar sus permisos de inmediato y no podrá asignarse a nuevos usuarios.'
          : 'volverá a otorgar sus permisos y podrá asignarse a los usuarios.'}
      </p>
      {desactivar && rol.usuarios_count > 0 && (
        <p className="text-suave">
          Actualmente {usuarios} este rol. Quienes no tengan otro rol activo no podrán iniciar sesión.
        </p>
      )}
    </ConfirmModal>
  )
}
