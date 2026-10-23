import { useState } from 'react'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Input } from '../../../../../shared/components/ui/Input'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { DIAS_MAXIMOS_DISPONIBILIDAD } from '../../../../../shared/utils/constants'
import { fechaISO, formatearFecha } from '../../../../../shared/utils/formatters'
import { useDisponibilidad } from '../../../hooks/useHorarios'

/** Estados de un turno (CU09, RN06) con su estilo y su texto. */
const ESTADOS = {
  disponible: { etiqueta: 'Disponible', clase: 'border-borde bg-white text-texto' },
  ocupado: { etiqueta: 'Ocupado', clase: 'border-primario bg-primario text-white' },
  bloqueado: { etiqueta: 'Bloqueado', clase: 'border-borde bg-gris text-suave' },
  pasado: { etiqueta: 'Pasado', clase: 'border-dashed border-borde bg-white text-sutil line-through' },
}

/**
 * Vista previa de la disponibilidad de un médico en una fecha (CU09, flujo 5).
 * @param {string} actualizacion  Cambia cuando se modifica la grilla, para recalcular los turnos.
 */
export function DisponibilidadDia({ idMedico, actualizacion }) {
  const [fecha, setFecha] = useState(fechaISO())
  const { disponibilidad, cargando, error } = useDisponibilidad(idMedico, fecha, actualizacion)
  const turnos = disponibilidad?.turnos ?? []

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Disponibilidad por fecha</h2>
          <p className="text-sm text-suave">Turnos del día según la grilla, las citas agendadas y las licencias.</p>
        </div>
        <div className="w-full sm:w-56">
          <Input
            etiqueta="Fecha"
            type="date"
            value={fecha}
            min={fechaISO()}
            max={fechaISO(DIAS_MAXIMOS_DISPONIBILIDAD)}
            onChange={(evento) => evento.target.value && setFecha(evento.target.value)}
          />
        </div>
      </div>

      {error && <Alert variante="error">{error}</Alert>}

      <div className="flex flex-col gap-4 rounded-md border border-borde bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold first-letter:uppercase">
            {new Intl.DateTimeFormat('es-BO', { weekday: 'long' }).format(new Date(`${fecha}T00:00`))}, {formatearFecha(`${fecha}T00:00`)}
          </p>
          <ul className="flex flex-wrap gap-3 text-xs" aria-label="Leyenda">
            {Object.entries(ESTADOS).map(([clave, { etiqueta, clase }]) => (
              <li key={clave} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`size-3 rounded-sm border ${clase}`} />
                {etiqueta} ({disponibilidad?.resumen?.[clave] ?? 0})
              </li>
            ))}
          </ul>
        </div>

        {cargando && !disponibilidad ? (
          <Spinner mensaje="Calculando turnos…" />
        ) : turnos.length === 0 ? (
          <p className="text-sm text-suave">
            {disponibilidad?.medico_activo === false ? 'El médico está inactivo y no tiene turnos.' : 'No hay atención programada para este día.'}
          </p>
        ) : (
          <ul className={`grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8 ${cargando ? 'opacity-60' : ''}`}>
            {turnos.map((turno) => (
              <li
                key={turno.hora_inicio}
                title={`${turno.hora_inicio}–${turno.hora_fin}: ${ESTADOS[turno.estado].etiqueta}`}
                className={`rounded-sm border px-2 py-2 text-center text-sm tabular-nums ${ESTADOS[turno.estado].clase}`}
              >
                {turno.hora_inicio}
                <span className="sr-only"> {ESTADOS[turno.estado].etiqueta}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
