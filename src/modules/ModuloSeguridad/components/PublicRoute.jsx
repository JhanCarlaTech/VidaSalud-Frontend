import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'

/**
 * Rutas solo para visitantes (login). Si ya hay una sesión activa,
 * redirige al panel inicial del rol del usuario.
 */
export function PublicRoute() {
  const { sesion, cargando } = useAuth()

  if (cargando) return <Spinner pantallaCompleta mensaje="Verificando sesión…" />

  if (sesion) return <Navigate to={sesion.ruta_inicio} replace />

  return <Outlet />
}
