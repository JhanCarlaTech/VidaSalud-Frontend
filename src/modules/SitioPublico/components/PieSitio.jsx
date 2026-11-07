import { Logo } from '../../../shared/components/ui/Logo'
import { CONTACTO_CLINICA, irASeccion, SECCIONES_SITIO } from '../utils/sitio'

/** Pie de la página principal. */
export function PieSitio() {
  return (
    <footer className="bg-marca text-sobre-marca">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo invertido />
          <p className="max-w-sm text-sm text-sobre-marca/70">Atención médica cercana y especializada, con reserva y pago de citas en línea.</p>
        </div>

        <nav aria-label="Secciones del sitio" className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-wider text-sobre-marca/70 uppercase">Secciones</h2>
          {SECCIONES_SITIO.map(({ id, etiqueta }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(evento) => {
                evento.preventDefault()
                irASeccion(id)
              }}
              className="w-fit text-sm hover:underline"
            >
              {etiqueta}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <h2 className="text-xs font-semibold tracking-wider text-sobre-marca/70 uppercase">Contacto</h2>
          <span>{CONTACTO_CLINICA.telefono}</span>
          <span>{CONTACTO_CLINICA.correo}</span>
          <span className="text-sobre-marca/70">{CONTACTO_CLINICA.direccion}</span>
        </div>
      </div>
      <p className="border-t border-sobre-marca/15 px-4 py-6 text-center text-xs text-sobre-marca/70">
        © {new Date().getFullYear()} Clínica Vida Salud. Todos los derechos reservados.
      </p>
    </footer>
  )
}
