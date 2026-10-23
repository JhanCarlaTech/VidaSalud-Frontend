import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../shared/utils/constants'
import { useAuth } from '../hooks/useAuth'

/**
 * Control de acceso (RBAC) de las rutas hijas: exige sesión activa y,
 * opcionalmente, alguno de los roles o el permiso indicados.
 * @param {string[]} [roles]
 * @param {string} [permiso]  Acción de la tabla `permiso`, ej.: 'usuarios_gestionar'.
 */
export function ProtectedRoute({ roles, permiso }) {
  const { sesion, cargando, tieneRol, canAccess } = useAuth()

  if (cargando) return <Spinner pantallaCompleta mensaje="Verificando sesión…" />

  if (!sesion) return <Navigate to={RUTAS.LOGIN} replace />

  if (roles && !tieneRol(...roles)) return <Navigate to={RUTAS.SIN_ACCESO} replace />

  if (permiso && !canAccess(permiso)) return <Navigate to={RUTAS.SIN_ACCESO} replace />

  return <Outlet />
}
