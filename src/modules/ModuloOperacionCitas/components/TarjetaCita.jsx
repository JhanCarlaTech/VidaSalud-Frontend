import { Badge } from '../../../shared/components/ui/Badge'
import { VARIANTE_ESTADO_CITA } from '../utils/citas'

const FORMATO_MES = new Intl.DateTimeFormat('es-BO', { month: 'short' })
const FORMATO_DIA_SEMANA = new Intl.DateTimeFormat('es-BO', { weekday: 'short' })

/**
 * Resumen de una cita: fecha destacada, hora, médico, modalidad, estado y código.
 * La usan "Mis citas" (CU13) y, más adelante, la reprogramación y cancelación (CU14).
 */
export function TarjetaCita({ cita, acciones }) {
  const fecha = new Date(`${cita.fecha}T00:00`)
  const cancelada = cita.estado === 'Cancelada'

  return (
    <article className="flex flex-col gap-4 rounded-md border border-borde bg-white p-4 sm:flex-row sm:items-center">
      <div
        className={`flex w-16 shrink-0 flex-col items-center rounded-sm py-2 ${cancelada ? 'bg-gris text-suave' : 'bg-primario text-white'}`}
        aria-hidden="true"
      >
        <span className="text-xs uppercase">{FORMATO_MES.format(fecha)}</span>
        <span className="text-2xl leading-none font-semibold">{fecha.getDate()}</span>
        <span className="text-xs">{FORMATO_DIA_SEMANA.format(fecha)}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`font-semibold tabular-nums ${cancelada ? 'line-through' : ''}`}>
            {cita.hora_inicio} – {cita.hora_fin}
          </span>
          <Badge variante={VARIANTE_ESTADO_CITA[cita.estado] ?? 'neutro'}>{cita.estado}</Badge>
          <span className="text-xs text-suave">{cita.codigo}</span>
        </div>
        <p className="text-sm">
          {cita.medico.nombre_completo} <span className="text-suave">· {cita.medico.especialidades.join(', ')}</span>
        </p>
        <p className="text-sm text-suave">
          {cita.modalidad.nombre}
          {cita.motivo && ` · ${cita.motivo}`}
        </p>
        {cita.motivo_cancelacion && <p className="text-sm text-suave">Motivo de cancelación: {cita.motivo_cancelacion}</p>}
      </div>

      {acciones && <div className="flex shrink-0 gap-2">{acciones}</div>}
    </article>
  )
}
