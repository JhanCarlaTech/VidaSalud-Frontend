import { Input } from '../../../../shared/components/ui/Input'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { Textarea } from '../../../../shared/components/ui/Textarea'
import { DIAS_MAXIMOS_DISPONIBILIDAD } from '../../../../shared/utils/constants'
import { fechaISO } from '../../../../shared/utils/formatters'
import { OpcionTarjeta } from '../../components/OpcionTarjeta'
import { SlotPicker } from '../../components/SlotPicker'
import { describirDias, fechaCorta } from '../../utils/citas'
import { useAgendarCitaPage } from './AgendarCitaPage'
import { ComprobanteCita } from './components/ComprobanteCita'
import { PasoPaciente } from './components/PasoPaciente'
import { ResumenCita } from './components/ResumenCita'

/** Sección numerada del asistente. */
function Paso({ numero, titulo, descripcion, children }) {
  return (
    <section className="flex flex-col gap-4 border-b border-borde pb-8 last:border-b-0">
      <header className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-primario text-xs font-semibold text-white">
          {numero}
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          {descripcion && <p className="text-sm text-suave">{descripcion}</p>}
        </div>
      </header>
      <div className="sm:pl-10">{children}</div>
    </section>
  )
}

/**
 * CU13 – Agendar una cita médica paso a paso.
 */
export function AgendarCitaPage() {
  const asistente = useAgendarCitaPage()

  if (asistente.citaAgendada) {
    return <ComprobanteCita cita={asistente.citaAgendada} esPersonal={asistente.esPersonal} onAgendarOtra={asistente.agendarOtra} />
  }

  // Numeración: el paso del paciente solo existe para el personal.
  const n = asistente.esPersonal ? 1 : 0

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{asistente.esPersonal ? 'Agendar cita' : 'Reservar cita'}</h1>
        <p className="text-suave">Elija la especialidad, el médico y un turno disponible.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex flex-col gap-8">
          {asistente.esPersonal && (
            <Paso numero={1} titulo="Paciente" descripcion="Busque al paciente por CI, nombre o código.">
              <PasoPaciente paciente={asistente.paciente} onElegir={asistente.elegirPaciente} />
            </Paso>
          )}

          <Paso numero={n + 1} titulo="Especialidad">
            <div role="radiogroup" aria-label="Especialidad" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {asistente.especialidades.map((especialidad) => (
                <OpcionTarjeta
                  key={especialidad.id}
                  seleccionada={asistente.especialidad?.id === especialidad.id}
                  onSeleccionar={() => asistente.elegirEspecialidad(especialidad)}
                >
                  <span className="font-semibold">{especialidad.nombre}</span>
                  {especialidad.descripcion && <span className="text-sm text-suave">{especialidad.descripcion}</span>}
                </OpcionTarjeta>
              ))}
            </div>
          </Paso>

          {asistente.especialidad && (
            <Paso numero={n + 2} titulo="Médico">
              {asistente.cargandoMedicos ? (
                <Spinner mensaje="Buscando médicos…" />
              ) : asistente.medicos.length === 0 ? (
                <p className="text-sm text-suave">No hay médicos disponibles para esta especialidad. Elija otra.</p>
              ) : (
                <div role="radiogroup" aria-label="Médico" className="grid gap-3 sm:grid-cols-2">
                  {asistente.medicos.map((medico) => (
                    <OpcionTarjeta
                      key={medico.id}
                      seleccionada={asistente.medico?.id === medico.id}
                      onSeleccionar={() => asistente.elegirMedico(medico)}
                    >
                      <span className="font-semibold">{medico.nombre_completo}</span>
                      <span className="text-sm text-suave">{medico.especialidades.join(', ')}</span>
                      <span className="text-xs text-suave">Atiende: {describirDias(medico.dias_atencion)}</span>
                    </OpcionTarjeta>
                  ))}
                </div>
              )}
            </Paso>
          )}

          {asistente.medico && (
            <Paso numero={n + 3} titulo="Fecha y turno" descripcion="Se muestran los próximos días en que atiende el médico.">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Próximas fechas de atención">
                    {asistente.fechasSugeridas.map((fecha) => (
                      <button
                        key={fecha}
                        type="button"
                        onClick={() => asistente.elegirFecha(fecha)}
                        aria-pressed={asistente.fecha === fecha}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
                          asistente.fecha === fecha ? 'border-primario bg-primario text-white' : 'border-borde bg-white hover:border-primario'
                        }`}
                      >
                        {fechaCorta(fecha)}
                      </button>
                    ))}
                  </div>
                  <div className="sm:ml-auto sm:w-48">
                    <Input
                      etiqueta="Otra fecha"
                      type="date"
                      value={asistente.fecha}
                      min={fechaISO()}
                      max={fechaISO(DIAS_MAXIMOS_DISPONIBILIDAD)}
                      onChange={(evento) => evento.target.value && asistente.elegirFecha(evento.target.value)}
                    />
                  </div>
                </div>

                {asistente.fecha &&
                  (asistente.cargandoTurnos && asistente.turnos.length === 0 ? (
                    <Spinner mensaje="Consultando turnos…" />
                  ) : asistente.turnos.length === 0 ? (
                    <p className="text-sm text-suave">El médico no atiende ese día. Elija una de las fechas sugeridas.</p>
                  ) : (
                    <SlotPicker
                      turnos={asistente.turnos}
                      seleccionado={asistente.turno}
                      onSeleccionar={asistente.elegirTurno}
                      deshabilitado={asistente.cargandoTurnos}
                    />
                  ))}
              </div>
            </Paso>
          )}

          {asistente.turno && (
            <Paso numero={n + 4} titulo="Modalidad y motivo">
              <div className="flex flex-col gap-5">
                <div role="radiogroup" aria-label="Modalidad de atención" className="grid gap-3 sm:grid-cols-3">
                  {asistente.modalidades.map((modalidad) => (
                    <OpcionTarjeta
                      key={modalidad.id}
                      seleccionada={asistente.idModalidad === modalidad.id}
                      onSeleccionar={() => asistente.elegirModalidad(modalidad.id)}
                    >
                      <span className="font-semibold">{modalidad.nombre}</span>
                    </OpcionTarjeta>
                  ))}
                </div>
                <Textarea
                  etiqueta="Motivo de la consulta"
                  name="motivo"
                  rows={3}
                  maxLength={500}
                  placeholder="Ej.: control de rutina, dolor de cabeza desde hace 3 días…"
                  value={asistente.motivo}
                  onChange={asistente.cambiarMotivo}
                  error={asistente.errores.motivo}
                />
              </div>
            </Paso>
          )}
        </div>

        <ResumenCita asistente={asistente} />
      </div>
    </section>
  )
}
