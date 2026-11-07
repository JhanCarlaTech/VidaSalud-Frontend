import { EspacioImagen } from './EspacioImagen'
import { Revelar } from './Revelar'
import { IMAGENES_SITIO, irASeccion } from '../utils/sitio'

const PASOS = ['Especialidad', 'Médico', 'Horario', 'Confirmar y pagar']

/**
 * Portada: nombre de la clínica, propuesta de valor y acceso directo a la reserva.
 * @param {number} totalEspecialidades
 * @param {() => void} onAgendar  Abre el asistente de reserva.
 */
export function SeccionPortada({ totalEspecialidades, onAgendar }) {
  return (
    <section id="inicio" className="fondo-puntos relative overflow-hidden border-b border-borde">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <Revelar className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-borde bg-superficie px-3 py-1 text-xs font-semibold tracking-wider text-suave uppercase">
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-primario" />
            Reservas en línea abiertas
          </span>

          <div className="flex flex-col gap-5">
            <h1 className="text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
              Clínica
              <br />
              Vida Salud
            </h1>
            <p className="max-w-lg text-lg text-suave">
              Atención médica cercana y especializada. Elija a su especialista, reserve un horario y pague su consulta
              desde casa, en pocos minutos.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAgendar}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primario px-7 text-sm font-semibold text-sobre-primario transition-colors hover:bg-primario-hover"
            >
              Agendar cita
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64l-4.2-3.96a.75.75 0 1 1 1.02-1.1l5.5 5.25a.75.75 0 0 1 0 1.1l-5.5 5.25a.75.75 0 1 1-1.02-1.1l4.2-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => irASeccion('especialidades')}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-borde bg-superficie px-7 text-sm font-semibold transition-colors hover:border-primario"
            >
              Ver especialidades
            </button>
          </div>

          <dl className="grid max-w-lg grid-cols-3 gap-4 border-t border-borde pt-6">
            <div>
              <dt className="text-xs text-suave">Especialidades</dt>
              <dd className="text-2xl font-semibold tabular-nums">{totalEspecialidades || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-suave">Reserva en línea</dt>
              <dd className="text-2xl font-semibold">24/7</dd>
            </div>
            <div>
              <dt className="text-xs text-suave">Emergencias</dt>
              <dd className="text-2xl font-semibold">24 h</dd>
            </div>
          </dl>
        </Revelar>

        <Revelar retraso={150} className="relative">
          <div className="aspect-[6/7] w-full">
            <EspacioImagen src={IMAGENES_SITIO.portada} descripcion="Fachada de la Clínica Vida Salud" tamano="1200 × 1400" prioridad />
          </div>

          {/* Tarjeta flotante: los pasos de la reserva */}
          <div className="absolute -bottom-6 left-4 right-4 rounded-xl border border-borde bg-superficie p-4 shadow-suave sm:left-auto sm:right-[-12px] sm:w-64">
            <p className="text-xs font-semibold tracking-wider text-suave uppercase">Reserve en 4 pasos</p>
            <ol className="mt-3 flex flex-col gap-2">
              {PASOS.map((paso, indice) => (
                <li key={paso} className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primario text-xs font-semibold text-sobre-primario">
                    {indice + 1}
                  </span>
                  {paso}
                </li>
              ))}
            </ol>
          </div>
        </Revelar>
      </div>
    </section>
  )
}
