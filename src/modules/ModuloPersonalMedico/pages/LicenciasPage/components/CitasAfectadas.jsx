import { Link } from 'react-router-dom'
import { useAuth } from '../../../../ModuloSeguridad/hooks/useAuth'
import { RUTAS } from '../../../../../shared/utils/constants'
import { formatearDia } from '../../../../../shared/utils/formatters'

/**
 * Citas pendientes que caen dentro de una licencia (CU10, RN05). La licencia se
 * registra igual; estas citas deben reprogramarse desde CU14.
 */
export function CitasAfectadas({ citas }) {
  const { canAccess } = useAuth()

  if (citas.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-peligro bg-peligro-fondo px-4 py-3">
      <p className="text-sm font-medium text-peligro">
        {citas.length === 1 ? 'Hay 1 cita pendiente' : `Hay ${citas.length} citas pendientes`} dentro de este periodo.
      </p>

      <ul className="flex flex-col divide-y divide-borde rounded-sm border border-borde bg-white text-sm">
        {citas.map((cita) => (
          <li key={cita.id} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span>
              <strong className="font-semibold">{formatearDia(cita.fecha, { dateStyle: 'medium' })}</strong>, {cita.hra_inicio} – {cita.hra_fin} ·{' '}
              {cita.paciente.nombre_completo}
            </span>
            <span className="text-suave">
              {cita.codigo_cita}
              {cita.paciente.telefono && ` · Tel. ${cita.paciente.telefono}`}
            </span>
          </li>
        ))}
      </ul>

      {/* Quien puede programar citas las reprograma; el médico avisa a recepción. */}
      {canAccess('citas_programar') ? (
        <p className="text-xs text-suave">
          Reprográmelas o cancélelas desde{' '}
          <Link to={RUTAS.CITAS} className="font-medium text-texto underline">
            Citas
          </Link>
          : los turnos de la licencia ya no se ofrecen para reservar.
        </p>
      ) : (
        <p className="text-xs text-suave">Recepción deberá reprogramarlas. Los turnos de la licencia ya no se ofrecen para reservar.</p>
      )}
    </div>
  )
}
