import { Spinner } from '../../../shared/components/ui/Spinner'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { EncabezadoSeccion } from './Encabezado'
import { Revelar } from './Revelar'

/**
 * Catálogo de especialidades con el precio de la consulta. "Reservar" la deja
 * elegida en el asistente de la sección "Agendar cita".
 */
export function SeccionEspecialidades({ especialidades, cargando, error, onReservar }) {
  return (
    <section id="especialidades" className="scroll-mt-16 border-b border-borde">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
        <Revelar>
          <EncabezadoSeccion
            antetitulo="Especialidades"
            titulo="Especialistas para cada etapa de su vida"
            descripcion="Conozca nuestras especialidades y el precio de la consulta. Elija una para empezar su reserva."
          />
        </Revelar>

        {cargando && especialidades.length === 0 ? (
          <Spinner mensaje="Cargando especialidades…" />
        ) : error ? (
          <p className="text-sm text-suave">No pudimos cargar las especialidades. Intente de nuevo en unos minutos.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {especialidades.map((especialidad, indice) => {
              const sinMedicos = especialidad.medicos_activos === 0

              return (
                <Revelar as="li" key={especialidad.id} retraso={(indice % 3) * 90}>
                  <article className="group flex h-full flex-col gap-5 rounded-xl border border-borde bg-superficie p-6 transition-all hover:-translate-y-1 hover:border-primario hover:shadow-suave">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className="grid size-11 place-items-center rounded-xl bg-gris text-lg font-bold transition-colors group-hover:bg-primario group-hover:text-sobre-primario"
                      >
                        {especialidad.nombre.charAt(0)}
                      </span>
                      <span className="text-right">
                        <span className="block text-xs text-suave">Consulta</span>
                        <span className="text-lg font-semibold tabular-nums">{formatearMoneda(especialidad.precio_consulta)}</span>
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <h3 className="text-lg font-semibold">{especialidad.nombre}</h3>
                      {especialidad.descripcion && <p className="text-sm text-suave">{especialidad.descripcion}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-borde pt-4">
                      <span className="text-xs text-suave">
                        {sinMedicos
                          ? 'Sin médicos disponibles'
                          : `${especialidad.medicos_activos} ${especialidad.medicos_activos === 1 ? 'médico' : 'médicos'}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onReservar(especialidad)}
                        disabled={sinMedicos}
                        className="cursor-pointer text-sm font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-sutil disabled:no-underline"
                      >
                        Reservar →
                      </button>
                    </div>
                  </article>
                </Revelar>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
