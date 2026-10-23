import { useInicioPage } from './InicioPage'

function Tarjeta({ titulo, children }) {
  return (
    <article className="flex flex-col gap-3 rounded-md border border-borde bg-white p-6">
      <h2 className="text-xs font-medium tracking-wider text-suave uppercase">{titulo}</h2>
      {children}
    </article>
  )
}

/**
 * Panel inicial de cada rol. Muestra el contexto de la cuenta; los módulos
 * de cada rol se incorporan en los siguientes casos de uso.
 */
export function InicioPage({ titulo, descripcion }) {
  const { saludo, correo, rolPrincipal, permisos } = useInicioPage()

  return (
    <section className="flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-suave">{saludo}</p>
        <h1 className="text-3xl font-semibold">{titulo}</h1>
        <p className="text-suave">{descripcion}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tarjeta titulo="Rol principal">
          <p className="text-2xl font-semibold">{rolPrincipal}</p>
        </Tarjeta>
        <Tarjeta titulo="Cuenta">
          <p className="font-semibold break-all">{correo}</p>
        </Tarjeta>
        <Tarjeta titulo="Permisos activos">
          <p className="text-2xl font-semibold">{permisos.length}</p>
        </Tarjeta>
      </div>

      <Tarjeta titulo="Permisos de su cuenta">
        {permisos.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {permisos.map(({ accion, etiqueta }) => (
              <li key={accion} className="rounded-full border border-borde bg-gris px-3 py-1 text-xs font-medium">
                {etiqueta}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-suave">Su rol no tiene permisos administrativos asignados.</p>
        )}
      </Tarjeta>
    </section>
  )
}
