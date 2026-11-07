import { Link } from 'react-router-dom'
import { RUTAS } from '../../../shared/utils/constants'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { fechaLarga } from '../../ModuloOperacionCitas/utils/citas'

function Dato({ etiqueta, children, ancho = false }) {
  return (
    <div className={`flex flex-col gap-0.5 ${ancho ? 'sm:col-span-2' : ''}`}>
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}

const MARCAS = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' }

/** 'visa' + '4242' → 'Visa •••• 4242' */
function describirTarjeta({ marca, ultimos4 }) {
  return `${MARCAS[marca] ?? 'Tarjeta'} •••• ${ultimos4}`
}

/** Etapa 'listo': comprobante de la cita agendada y de su pago. */
export function ReservaConfirmada({ cita, pago, onReservarOtra }) {
  const pendiente = pago.estado === 'Pendiente'
  const estadoPago = pendiente
    ? /efectivo/i.test(pago.metodo ?? '')
      ? 'Pendiente (en recepción)'
      : 'Pendiente de verificación'
    : 'Pagado'

  return (
    <div className="flex flex-col items-center gap-8 py-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-primario text-sobre-primario">
          <svg viewBox="0 0 20 20" className="size-8 fill-current">
            <path d="M7.6 13.6 4 10l-1.4 1.4 5 5 10-10L16.2 5z" />
          </svg>
        </span>
        <h3 className="text-3xl font-semibold">¡Cita confirmada!</h3>
        <p className="text-suave">
          Código <strong className="font-semibold text-texto">{cita.codigo}</strong> · Guárdelo para cualquier consulta.
        </p>
      </div>

      <dl className="grid w-full max-w-xl gap-4 rounded-xl border border-borde bg-superficie p-6 text-left sm:grid-cols-2">
        <Dato etiqueta="Fecha y hora" ancho>
          <span className="capitalize">{fechaLarga(cita.fecha)}</span>, {cita.hora_inicio} – {cita.hora_fin}
        </Dato>
        <Dato etiqueta="Médico">{cita.medico.nombre_completo}</Dato>
        <Dato etiqueta="Modalidad">{cita.modalidad.nombre}</Dato>
        <Dato etiqueta="Pago">
          {formatearMoneda(pago.monto)} · {pago.tarjeta ? describirTarjeta(pago.tarjeta) : pago.metodo}
        </Dato>
        <Dato etiqueta="Estado del pago">
          {estadoPago}
          {pago.recibo_url && (
            <>
              {' · '}
              <a href={pago.recibo_url} target="_blank" rel="noreferrer" className="font-semibold underline">
                Ver recibo
              </a>
            </>
          )}
        </Dato>
      </dl>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onReservarOtra}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-borde bg-superficie px-6 text-sm font-semibold hover:border-primario"
        >
          Reservar otra cita
        </button>
        <Link
          to={RUTAS.PACIENTE_CITAS}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primario px-6 text-sm font-semibold text-sobre-primario hover:bg-primario-hover"
        >
          Ver mis citas
        </Link>
      </div>
    </div>
  )
}
