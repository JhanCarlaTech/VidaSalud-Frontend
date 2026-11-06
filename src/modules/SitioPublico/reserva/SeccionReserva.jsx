import { Link } from 'react-router-dom'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Modal } from '../../../shared/components/ui/Modal'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { Textarea } from '../../../shared/components/ui/Textarea'
import { DIAS_MAXIMOS_DISPONIBILIDAD, RUTAS } from '../../../shared/utils/constants'
import { etiquetaRol, fechaISO, formatearMoneda } from '../../../shared/utils/formatters'
import { OpcionTarjeta } from '../../ModuloOperacionCitas/components/OpcionTarjeta'
import { SlotPicker } from '../../ModuloOperacionCitas/components/SlotPicker'
import { describirDias, fechaCorta, fechaLarga } from '../../ModuloOperacionCitas/utils/citas'
import { EncabezadoSeccion } from '../components/Encabezado'
import { Revelar } from '../components/Revelar'
import { PasoCuenta } from './PasoCuenta'
import { PasoPago } from './PasoPago'
import { ReservaConfirmada } from './ReservaConfirmada'
import { ETAPAS, esSesionDePaciente } from './useReservaEnLinea'

const PROGRESO = [
  { etapa: ETAPAS.ELECCION, etiqueta: 'Elija su cita' },
  { etapa: ETAPAS.CUENTA, etiqueta: 'Su cuenta' },
  { etapa: ETAPAS.PAGO, etiqueta: 'Pago' },
  { etapa: ETAPAS.LISTO, etiqueta: 'Confirmación' },
]

function Progreso({ etapa }) {
  const actual = PROGRESO.findIndex((paso) => paso.etapa === etapa)

  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Progreso de la reserva">
      {PROGRESO.map((paso, indice) => {
        const hecho = indice < actual
        const enCurso = indice === actual

        return (
          <li key={paso.etapa} aria-current={enCurso ? 'step' : undefined} className="flex flex-col gap-2">
            <span className={`h-1 rounded-full transition-colors duration-500 ${hecho || enCurso ? 'bg-primario' : 'bg-borde'}`} />
            <span className={`text-xs font-medium ${enCurso ? 'text-texto' : 'text-suave'}`}>
              <span className="hidden sm:inline">{indice + 1}. </span>
              {paso.etiqueta}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Paso numerado de la elección de la cita. */
function Paso({ numero, titulo, descripcion, children }) {
  return (
    <section className="flex flex-col gap-4 border-b border-borde pb-8 last:border-b-0 last:pb-0">
      <header className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-primario text-xs font-semibold text-white">
          {numero}
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-lg font-semibold">{titulo}</h3>
          {descripcion && <p className="text-sm text-suave">{descripcion}</p>}
        </div>
      </header>
      <div className="sm:pl-10">{children}</div>
    </section>
  )
}

function Fila({ etiqueta, valor }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className={`text-sm ${valor ? 'font-medium' : 'text-sutil'}`}>{valor || 'Sin elegir'}</dd>
    </div>
  )
}

/** Resumen de la reserva con el precio de la consulta y el botón de confirmación. */
function Resumen({ reserva, bloqueadaPorRol }) {
  const turnoElegido = reserva.turnos.find((turno) => turno.hora_inicio === reserva.turno)
  const modalidad = reserva.modalidades.find((m) => m.id === reserva.idModalidad)
  const enEleccion = reserva.etapa === ETAPAS.ELECCION

  return (
    <aside className="flex flex-col gap-5 rounded-md border border-borde bg-white p-5 lg:sticky lg:top-0">
      <h3 className="text-lg font-semibold">Resumen</h3>

      <dl className="flex flex-col gap-3">
        <Fila etiqueta="Especialidad" valor={reserva.especialidad?.nombre} />
        <Fila etiqueta="Médico" valor={reserva.medico?.nombre_completo} />
        <Fila etiqueta="Fecha" valor={reserva.fecha && <span className="capitalize">{fechaLarga(reserva.fecha)}</span>} />
        <Fila etiqueta="Hora" valor={turnoElegido && `${turnoElegido.hora_inicio} – ${turnoElegido.hora_fin}`} />
        <Fila etiqueta="Modalidad" valor={modalidad?.nombre} />
      </dl>

      <div className="flex items-baseline justify-between border-t border-borde pt-4">
        <span className="text-sm text-suave">Consulta</span>
        <span className="text-2xl font-bold tabular-nums">
          {reserva.especialidad ? formatearMoneda(reserva.especialidad.precio_consulta) : '—'}
        </span>
      </div>

      {enEleccion && (
        <>
          {reserva.errorGeneral && <Alert variante="error">{reserva.errorGeneral}</Alert>}
          <Button bloque onClick={reserva.confirmar} disabled={!reserva.completa || bloqueadaPorRol} cargando={reserva.agendando}>
            Confirmar cita
          </Button>
          <p className="text-center text-xs text-suave">
            {!reserva.completa
              ? 'Complete todos los pasos para confirmar.'
              : reserva.sesion
                ? 'Se agendará a su nombre y pasará al pago.'
                : 'Luego creará su cuenta o iniciará sesión para pagar.'}
          </p>
        </>
      )}
    </aside>
  )
}

/** Etapa 'eleccion': especialidad → médico → fecha y turno → modalidad y motivo. */
function Eleccion({ reserva, especialidades }) {
  return (
    <div className="flex flex-col gap-8">
      <Paso numero={1} titulo="Especialidad" descripcion="El precio de la consulta depende de la especialidad.">
        <div role="radiogroup" aria-label="Especialidad" className="grid gap-3 sm:grid-cols-2">
          {especialidades.map((especialidad) => (
            <OpcionTarjeta
              key={especialidad.id}
              seleccionada={reserva.especialidad?.id === especialidad.id}
              onSeleccionar={() => reserva.elegirEspecialidad(especialidad)}
              disabled={especialidad.medicos_activos === 0}
            >
              <span className="flex w-full items-baseline justify-between gap-3">
                <span className="font-semibold">{especialidad.nombre}</span>
                <span className="text-sm font-semibold tabular-nums">{formatearMoneda(especialidad.precio_consulta)}</span>
              </span>
              <span className="text-sm text-suave">
                {especialidad.medicos_activos === 0 ? 'Sin médicos disponibles por ahora' : especialidad.descripcion}
              </span>
            </OpcionTarjeta>
          ))}
        </div>
      </Paso>

      {reserva.especialidad && (
        <Paso numero={2} titulo="Médico">
          {reserva.cargandoMedicos && reserva.medicos.length === 0 ? (
            <Spinner mensaje="Buscando médicos…" />
          ) : reserva.medicos.length === 0 ? (
            <p className="text-sm text-suave">No hay médicos disponibles para esta especialidad. Elija otra.</p>
          ) : (
            <div role="radiogroup" aria-label="Médico" className="grid gap-3 sm:grid-cols-2">
              {reserva.medicos.map((medico) => (
                <OpcionTarjeta
                  key={medico.id}
                  seleccionada={reserva.medico?.id === medico.id}
                  onSeleccionar={() => reserva.elegirMedico(medico)}
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

      {reserva.medico && (
        <Paso numero={3} titulo="Fecha y horario" descripcion="Se muestran los próximos días en que atiende el médico.">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Próximas fechas de atención">
                {reserva.fechasSugeridas.map((fecha) => (
                  <button
                    key={fecha}
                    type="button"
                    onClick={() => reserva.elegirFecha(fecha)}
                    aria-pressed={reserva.fecha === fecha}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
                      reserva.fecha === fecha ? 'border-primario bg-primario text-white' : 'border-borde bg-white hover:border-primario'
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
                  value={reserva.fecha}
                  min={fechaISO()}
                  max={fechaISO(DIAS_MAXIMOS_DISPONIBILIDAD)}
                  onChange={(evento) => evento.target.value && reserva.elegirFecha(evento.target.value)}
                />
              </div>
            </div>

            {reserva.fecha &&
              (reserva.cargandoTurnos && reserva.turnos.length === 0 ? (
                <Spinner mensaje="Consultando horarios…" />
              ) : reserva.turnos.length === 0 ? (
                <p className="text-sm text-suave">El médico no atiende ese día. Elija una de las fechas sugeridas.</p>
              ) : (
                <SlotPicker
                  turnos={reserva.turnos}
                  seleccionado={reserva.turno}
                  onSeleccionar={reserva.elegirTurno}
                  deshabilitado={reserva.cargandoTurnos}
                />
              ))}
          </div>
        </Paso>
      )}

      {reserva.turno && (
        <Paso numero={4} titulo="Modalidad y motivo">
          <div className="flex flex-col gap-5">
            <div role="radiogroup" aria-label="Modalidad de atención" className="grid gap-3 sm:grid-cols-3">
              {reserva.modalidades.map((modalidad) => (
                <OpcionTarjeta
                  key={modalidad.id}
                  seleccionada={reserva.idModalidad === modalidad.id}
                  onSeleccionar={() => reserva.elegirModalidad(modalidad.id)}
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
              value={reserva.motivo}
              onChange={reserva.cambiarMotivo}
              error={reserva.errores.motivo}
            />
          </div>
        </Paso>
      )}
    </div>
  )
}

/**
 * Sección central de la página principal: un botón abre la ventana con la
 * reserva y el pago de una cita médica desde internet (CU13 + CU24). El
 * personal con sesión ve la página, pero agenda a nombre de los pacientes desde su panel.
 */
export function SeccionReserva({ reserva, especialidades }) {
  const enCurso = reserva.etapa !== ETAPAS.ELECCION || Boolean(reserva.especialidad)

  return (
    <section id="agendar" className="fondo-puntos scroll-mt-16 border-b border-borde">
      <Revelar className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 sm:px-6">
        <EncabezadoSeccion
          antetitulo="Agendar cita"
          titulo="Reserve su cita médica en línea"
          descripcion="Elija la especialidad, el médico y el horario disponible. Confirme y pague su consulta en el mismo lugar."
          centrado
        />
        <button
          type="button"
          onClick={() => reserva.abrir()}
          className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-sm bg-primario px-10 text-base font-semibold text-white shadow-suave transition-all hover:-translate-y-0.5 hover:bg-primario-hover"
        >
          {enCurso ? 'Continuar mi reserva' : 'Agendar cita'}
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.64l-4.2-3.96a.75.75 0 1 1 1.02-1.1l5.5 5.25a.75.75 0 0 1 0 1.1l-5.5 5.25a.75.75 0 1 1-1.02-1.1l4.2-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </button>
      </Revelar>

      <Modal
        abierto={reserva.abierta}
        ancho="xl"
        titulo="Agendar cita"
        descripcion="Elija la especialidad, el médico y el horario disponible."
        onCerrar={reserva.cerrar}
      >
        <AsistenteReserva reserva={reserva} especialidades={especialidades} />
      </Modal>
    </section>
  )
}

/** Contenido de la ventana: progreso, etapa actual y resumen. */
function AsistenteReserva({ reserva, especialidades }) {
  const { etapa, sesion } = reserva
  const bloqueadaPorRol = Boolean(sesion) && !esSesionDePaciente(sesion)

  return (
    <div className="flex flex-col gap-8">
      <Progreso etapa={etapa} />

      {bloqueadaPorRol && etapa === ETAPAS.ELECCION && (
        <Alert>
          Tiene la sesión iniciada como {etiquetaRol(sesion.rol_principal)}. La reserva en línea es para pacientes;
          {sesion.permisos.includes('citas_programar') ? (
            <>
              {' '}para agendar a nombre de un paciente use{' '}
              <Link to={RUTAS.CITAS_NUEVA} className="font-semibold underline">
                Agendar cita en su panel
              </Link>
              .
            </>
          ) : (
            ' puede explorar los horarios, pero no confirmar una cita.'
          )}
        </Alert>
      )}

      {etapa === ETAPAS.LISTO ? (
        <ReservaConfirmada cita={reserva.cita} pago={reserva.pago} onReservarOtra={reserva.reiniciar} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          {etapa === ETAPAS.ELECCION && <Eleccion reserva={reserva} especialidades={especialidades} />}
          {etapa === ETAPAS.CUENTA && (
            <PasoCuenta agendando={reserva.agendando} onSesion={reserva.agendar} onVolver={reserva.volverAEleccion} />
          )}
          {etapa === ETAPAS.PAGO && (
            <PasoPago cita={reserva.cita} monto={reserva.especialidad.precio_consulta} onPagado={reserva.finalizarPago} />
          )}
          <Resumen reserva={reserva} bloqueadaPorRol={bloqueadaPorRol} />
        </div>
      )}
    </div>
  )
}
