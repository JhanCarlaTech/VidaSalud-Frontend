import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../../../shared/components/ui/Logo'
import { RUTAS } from '../../../shared/utils/constants'
import { etiquetaRol } from '../../../shared/utils/formatters'
import { useAuth } from '../../ModuloSeguridad/hooks/useAuth'
import { irASeccion, SECCIONES_SITIO } from '../utils/sitio'

const BOTON = 'inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors'
const BOTON_PRIMARIO = `${BOTON} border-primario bg-primario text-white hover:bg-primario-hover`
const BOTON_SECUNDARIO = `${BOTON} border-borde bg-white text-texto hover:border-primario`

/** Id de la sección que ocupa la parte superior de la pantalla (resalta su enlace en el menú). */
function useSeccionActiva() {
  const [activa, setActiva] = useState('')

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((entrada) => entrada.isIntersecting)
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECCIONES_SITIO.forEach(({ id }) => {
      const seccion = document.getElementById(id)
      if (seccion) observador.observe(seccion)
    })

    return () => observador.disconnect()
  }, [])

  return activa
}

/** Botones de la esquina superior derecha: acceso para visitantes o acceso al panel con sesión. */
function AccionesCuenta({ bloque = false }) {
  const { sesion } = useAuth()
  const ancho = bloque ? 'w-full' : ''

  if (sesion) {
    return (
      <Link to={sesion.ruta_inicio} className={`${BOTON_PRIMARIO} ${ancho}`}>
        Ir a mi panel · {etiquetaRol(sesion.rol_principal)}
      </Link>
    )
  }

  return (
    <>
      <Link to={RUTAS.LOGIN} className={`${BOTON_SECUNDARIO} ${ancho}`}>
        Iniciar sesión
      </Link>
      <Link to={RUTAS.REGISTRO} className={`${BOTON_PRIMARIO} ${ancho}`}>
        Regístrate
      </Link>
    </>
  )
}

/**
 * Encabezado fijo de la página principal: marca, menú de secciones y acceso a la cuenta.
 * En móvil el menú se despliega con el botón de hamburguesa.
 */
export function EncabezadoSitio() {
  const activa = useSeccionActiva()
  const [conSombra, setConSombra] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const actualizar = () => setConSombra(window.scrollY > 8)
    actualizar()
    window.addEventListener('scroll', actualizar, { passive: true })
    return () => window.removeEventListener('scroll', actualizar)
  }, [])

  function navegar(evento, id) {
    evento.preventDefault()
    setMenuAbierto(false)
    irASeccion(id)
  }

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-fondo/85 backdrop-blur transition-shadow ${
        conSombra ? 'border-borde shadow-suave' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#inicio" onClick={(evento) => navegar(evento, 'inicio')} aria-label="Vida Salud, ir al inicio">
          <Logo />
        </a>

        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {SECCIONES_SITIO.map(({ id, etiqueta }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(evento) => navegar(evento, id)}
                  aria-current={activa === id ? 'true' : undefined}
                  className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    activa === id ? 'bg-gris text-texto' : 'text-suave hover:text-texto'
                  }`}
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <AccionesCuenta />
        </div>

        <button
          type="button"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          className="grid size-10 cursor-pointer place-items-center rounded-sm border border-borde lg:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
            {menuAbierto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <div id="menu-movil" className="border-t border-borde bg-fondo px-4 pb-5 lg:hidden">
          <ul className="flex flex-col py-2">
            {SECCIONES_SITIO.map(({ id, etiqueta }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(evento) => navegar(evento, id)}
                  className="block rounded-sm px-2 py-3 text-base font-medium hover:bg-gris"
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 sm:hidden">
            <AccionesCuenta bloque />
          </div>
        </div>
      )}
    </header>
  )
}
