import { etiquetaRol, formatearPermiso, saludoSegunHora } from '../../../../shared/utils/formatters'
import { useAuth } from '../../hooks/useAuth'

/**
 * Datos del panel inicial que ve cada rol tras iniciar sesión (CU01).
 */
export function useInicioPage() {
  const { sesion, usuario } = useAuth()

  return {
    saludo: `${saludoSegunHora()}, ${usuario.nombre}`,
    correo: usuario.correo,
    rolPrincipal: etiquetaRol(sesion.rol_principal),
    permisos: sesion.permisos.map((accion) => ({ accion, etiqueta: formatearPermiso(accion) })),
  }
}
