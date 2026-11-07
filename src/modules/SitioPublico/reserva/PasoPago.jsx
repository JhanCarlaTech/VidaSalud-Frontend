import { PagoCita } from '../../ModuloOperacionCitas/components/PagoCita'

/**
 * Etapa 'pago' (CU24) de la reserva en línea: la cita ya está agendada y se
 * cobra el precio de la consulta de la especialidad elegida.
 */
export function PasoPago({ cita, especialidad, onPagado }) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gris px-3 py-1 text-xs font-semibold">
          <span aria-hidden="true">✓</span> Cita {cita.codigo} reservada
        </span>
        <h3 className="text-2xl font-semibold">Pague su consulta</h3>
        <p className="text-sm text-suave">Elija cómo desea pagar. Puede hacerlo ahora con tarjeta o al llegar a la clínica.</p>
      </header>

      <PagoCita cita={cita} especialidad={especialidad} onPagado={onPagado} />
    </div>
  )
}
