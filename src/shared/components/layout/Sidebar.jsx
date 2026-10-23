import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../modules/ModuloSeguridad/hooks/useAuth'
import { MENU_POR_ROL, RUTAS } from '../../utils/constants'
import { etiquetaRol, iniciales } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

/** Une las opciones de menú de todos los roles del usuario, sin duplicados. */
function menuParaRoles(roles) {
  const opciones = roles.flatMap((rol) => MENU_POR_ROL[rol] ?? [])
  const unicas = new Map(opciones.map((opcion) => [opcion.ruta, opcion]))

  return unicas.size > 0 ? [...unicas.values()] : [{ ruta: RUTAS.INICIO, etiqueta: 'Inicio' }]
}

function clasesEnlace({ isActive }) {
  const base = 'block rounded-sm px-3 py-2 text-sm font-medium transition-colors'
  return isActive ? `${base} bg-primario text-white` : `${base} text-suave hover:bg-gris hover:text-texto`
}

/**
 * Menú lateral: opciones según los roles del usuario, datos de la cuenta
 * y cierre de sesión. En móvil se convierte en una barra superior.
 */
export function Sidebar() {
  const { sesion, usuario, logout } = useAuth()
  const [cerrando, setCerrando] = useState(false)

  // Al limpiarse la sesión, ProtectedRoute redirige al login.
  async function manejarCierreSesion() {
    setCerrando(true)
    await logout()
  }

  return (
    <aside className="flex flex-col gap-4 border-b border-borde bg-superficie p-4 md:sticky md:top-0 md:h-screen md:gap-8 md:border-r md:border-b-0 md:p-6">
      <Logo />

      <nav aria-label="Navegación principal" className="md:flex-1">
        <ul className="flex flex-wrap gap-1 md:flex-col">
          {menuParaRoles(sesion.roles).map((opcion) => (
            <li key={opcion.ruta}>
              <NavLink to={opcion.ruta} className={clasesEnlace}>
                {opcion.etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-between gap-4 border-t border-borde pt-4 md:flex-col md:items-stretch md:pt-6">
        {/* CU05: el bloque de la cuenta lleva al perfil personal */}
        <NavLink
          to={RUTAS.PERFIL}
          title="Mi perfil"
          className={({ isActive }) =>
            `-m-2 flex min-w-0 items-center gap-3 rounded-sm p-2 transition-colors hover:bg-gris ${isActive ? 'bg-gris' : ''}`
          }
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primario text-xs font-semibold text-white"
          >
            {iniciales(usuario)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{usuario.nombre_completo}</p>
            <p className="text-xs text-suave">{etiquetaRol(sesion.rol_principal)} · Mi perfil</p>
          </div>
        </NavLink>
        <Button variante="secundario" cargando={cerrando} onClick={manejarCierreSesion} className="md:w-full">
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
