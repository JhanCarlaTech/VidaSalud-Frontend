import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../../shared/components/ui/Button'
import { RUTAS } from '../../../../../shared/utils/constants'
import { fechaLarga } from '../../../utils/citas'

/**
 * Comprobante que se muestra al agendar la cita (CU13, paso 6).
 */
export function ComprobanteCita({ cita, esPersonal, onAgendarOtra }) {
  const navigate = useNavigate()

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-primario text-white">
          <svg viewBox="0 0 20 20" className="size-7 fill-current">
            <path d="M7.6 13.6 4 10l-1.4 1.4 5 5 10-10L16.2 5z" />
          </svg>
        </span>
        <h1 className="text-3xl font-semibold">Cita agendada</h1>
        <p className="text-suave">
          Código <strong className="font-semibold text-texto">{cita.codigo}</strong> · Estado {cita.estado}
        </p>
      </div>

      <dl className="grid gap-4 rounded-md border border-borde bg-white p-6 sm:grid-cols-2">
        {esPersonal && (
          <div className="flex flex-col gap-0.5 sm:col-span-2">
            <dt className="text-xs font-medium tracking-wider text-suave uppercase">Paciente</dt>
            <dd className="font-medium">{cita.paciente.nombre_completo}</dd>
          </div>
        )}
        <div className="flex flex-col gap-0.5 sm:col-span-2">
          <dt className="text-xs font-medium tracking-wider text-suave uppercase">Fecha y hora</dt>
          <dd className="font-medium capitalize">
            {fechaLarga(cita.fecha)}, {cita.hora_inicio} – {cita.hora_fin}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium tracking-wider text-suave uppercase">Médico</dt>
          <dd className="font-medium">{cita.medico.nombre_completo}</dd>
          <dd className="text-sm text-suave">{cita.medico.especialidades.join(', ')}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium tracking-wider text-suave uppercase">Modalidad</dt>
          <dd className="font-medium">{cita.modalidad.nombre}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variante="secundario" onClick={onAgendarOtra}>
          {esPersonal ? 'Agendar otra cita' : 'Reservar otra cita'}
        </Button>
        {!esPersonal && <Button onClick={() => navigate(RUTAS.PACIENTE_CITAS)}>Ver mis citas</Button>}
      </div>
    </section>
  )
}
