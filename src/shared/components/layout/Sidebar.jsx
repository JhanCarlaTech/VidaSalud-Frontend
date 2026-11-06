import { useId, useState } from 'react'
import { Link, matchPath, NavLink, useLocation } from 'react-router-dom'
import { useNoLeidas } from '../../../modules/ModuloInteligenciaReportes/hooks/useNoLeidas'
import { useAuth } from '../../../modules/ModuloSeguridad/hooks/useAuth'
import { MENU_POR_ROL, MODULOS, RUTAS } from '../../utils/constants'
import { etiquetaRol, iniciales } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

/** Une las opciones de menú de todos los roles del usuario, sin duplicados. */
function menuParaRoles(roles) {
  const opciones = roles.flatMap((rol) => MENU_POR_ROL[rol] ?? [])
  const unicas = new Map(opciones.map((opcion) => [opcion.ruta, opcion]))

  return unicas.size > 0 ? [...unicas.values()] : [{ ruta: RUTAS.INICIO, etiqueta: 'Inicio' }]
}

/** Separa las opciones sin módulo (inicio) de las que se agrupan por módulo, en el orden de MODULOS. */
function agruparPorModulo(opciones) {
  const sueltas = opciones.filter((opcion) => !opcion.modulo)
  const grupos = Object.values(MODULOS)
    .map((modulo) => ({ modulo, opciones: opciones.filter((opcion) => opcion.modulo === modulo) }))
    .filter((grupo) => grupo.opciones.length > 0)

  return { sueltas, grupos }
}

function clasesEnlace({ isActive }) {
  const base = 'flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors'
  return isActive ? `${base} bg-primario text-white` : `${base} text-suave hover:bg-gris hover:text-texto`
}

/** Texto de la opción con su contador, si lo tiene (CU20: notificaciones sin leer). */
function EtiquetaOpcion({ opcion, contadores }) {
  const cantidad = opcion.contador ? contadores[opcion.contador] : 0

  return (
    <>
      {opcion.etiqueta}
      {cantidad > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-peligro px-1.5 text-xs leading-5 font-semibold text-white">
          {cantidad > 99 ? '99+' : cantidad}
          <span className="sr-only"> sin leer</span>
        </span>
      )}
    </>
  )
}

/**
 * Selector desplegable de un módulo con sus casos de uso. Empieza abierto si
 * contiene la página actual; después manda lo que elija el usuario.
 */
function GrupoModulo({ modulo, opciones, contadores }) {
  const { pathname } = useLocation()
  const idSubmenu = useId()
  const contieneActiva = opciones.some((opcion) => matchPath({ path: opcion.ruta, end: false }, pathname))
  const [abiertoManual, setAbiertoManual] = useState(null)
  const abierto = abiertoManual ?? contieneActiva
  // Con el grupo cerrado, un punto avisa que alguna opción tiene novedades.
  const conNovedades = !abierto && opciones.some((opcion) => opcion.contador && contadores[opcion.contador] > 0)

  return (
    <li>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={idSubmenu}
        onClick={() => setAbiertoManual(!abierto)}
        className={`flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-gris ${contieneActiva ? 'text-texto' : 'text-suave hover:text-texto'}`}
      >
        <span className="flex items-center gap-2">
          {modulo}
          {conNovedades && (
            <span className="size-2 rounded-full bg-peligro">
              <span className="sr-only">Tiene notificaciones sin leer</span>
            </span>
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 shrink-0 transition-transform ${abierto ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {abierto && (
        <ul id={idSubmenu} className="mt-1 ml-3 flex flex-col gap-1 border-l border-borde pl-2">
          {opciones.map((opcion) => (
            <li key={opcion.ruta}>
              <NavLink to={opcion.ruta} className={clasesEnlace}>
                <EtiquetaOpcion opcion={opcion} contadores={contadores} />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * Menú lateral: opciones según los roles del usuario, datos de la cuenta
 * y cierre de sesión. En móvil se convierte en una barra superior.
 */
export function Sidebar() {
  const { sesion, usuario, logout } = useAuth()
  const [cerrando, setCerrando] = useState(false)
  const menu = menuParaRoles(sesion.roles)
  const { sueltas, grupos } = agruparPorModulo(menu)
  // CU20: solo se consulta el contador si el menú tiene la bandeja de notificaciones.
  const contadores = { notificaciones: useNoLeidas(menu.some((opcion) => opcion.contador === 'notificaciones')) }

  // Al limpiarse la sesión, ProtectedRoute redirige al login.
  async function manejarCierreSesion() {
    setCerrando(true)
    await logout()
  }

  return (
    <aside className="flex flex-col gap-4 border-b border-borde bg-superficie p-4 md:sticky md:top-0 md:h-screen md:gap-8 md:border-r md:border-b-0 md:p-6">
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-start md:gap-3">
        <Link to={RUTAS.SITIO} aria-label="Vida Salud, ir a la página principal">
          <Logo />
        </Link>
        <Link to={RUTAS.SITIO} className="text-xs font-semibold text-suave underline-offset-2 hover:text-texto hover:underline">
          ← Página principal
        </Link>
      </div>

      <nav aria-label="Navegación principal" className="md:min-h-0 md:flex-1 md:overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {sueltas.map((opcion) => (
            <li key={opcion.ruta}>
              <NavLink to={opcion.ruta} className={clasesEnlace}>
                <EtiquetaOpcion opcion={opcion} contadores={contadores} />
              </NavLink>
            </li>
          ))}
          {grupos.map((grupo) => (
            <GrupoModulo key={grupo.modulo} modulo={grupo.modulo} opciones={grupo.opciones} contadores={contadores} />
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
