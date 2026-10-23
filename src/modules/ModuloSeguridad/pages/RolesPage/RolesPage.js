import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useAuth } from '../../hooks/useAuth'
import { usePermisos } from '../../hooks/usePermisos'
import { useRoles } from '../../hooks/useRoles'

/**
 * Lógica de la página de roles (CU03): listado, modales de alta/edición
 * y cambio de estado, y avisos de resultado.
 */
export function useRolesPage() {
  const { sesion, refrescarSesion } = useAuth()
  const { roles, cargando, error, recargar } = useRoles()
  const { permisos, error: errorPermisos } = usePermisos()
  // modal = null | { tipo: 'formulario', rol: object | null } | { tipo: 'estado', rol: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  /**
   * Tras guardar: si se modificó un rol del propio usuario, se releen sus
   * permisos para que el menú y las rutas reflejen el cambio (RN06).
   */
  function finalizarOperacion(mensaje, rolAfectado) {
    setModal(null)
    setAviso(mensaje)
    recargar()

    if (rolAfectado && sesion.roles.includes(rolAfectado.nombre)) {
      refrescarSesion()
    }
  }

  return {
    roles,
    permisos,
    cargando,
    error: error || errorPermisos,
    aviso,
    modal,
    abrirNuevo: () => setModal({ tipo: 'formulario', rol: null }),
    abrirEdicion: (rol) => setModal({ tipo: 'formulario', rol }),
    abrirCambioEstado: (rol) => setModal({ tipo: 'estado', rol }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
