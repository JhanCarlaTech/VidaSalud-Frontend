import { useState } from 'react'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../shared/hooks/useConsulta'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { OpcionTarjeta } from '../../ModuloOperacionCitas/components/OpcionTarjeta'
import { PagoConTarjeta } from '../../ModuloOperacionCitas/components/PagoConTarjeta'
import { listarMetodosPago, registrarPago } from '../../ModuloOperacionCitas/services/pago.service'

function esPagoEnRecepcion(metodo) {
  return /efectivo/i.test(metodo?.nombre ?? '')
}

/**
 * Etapa 'pago' (CU24): la cita ya está agendada y se cobra el precio de la
 * consulta de la especialidad elegida.
 * - Tarjeta: se cobra en el momento con Stripe.
 * - QR, transferencia o efectivo: queda pendiente hasta que recepción lo verifique.
 */
export function PasoPago({ cita, especialidad, onPagado }) {
  const { datos: metodos, cargando, error: errorMetodos } = useConsulta(listarMetodosPago)
  const [idMetodo, setIdMetodo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const monto = especialidad.precio_consulta
  const metodo = metodos?.find((m) => m.id === idMetodo)

  async function registrarPendiente() {
    setError('')
    setEnviando(true)
    try {
      const respuesta = await registrarPago({ id_cita: cita.id, id_metodo_pago: idMetodo, monto })
      onPagado(respuesta.data)
    } catch (err) {
      setError(err.errors ? Object.values(err.errors)[0][0] : err.message)
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gris px-3 py-1 text-xs font-semibold">
          <span aria-hidden="true">✓</span> Cita {cita.codigo} reservada
        </span>
        <h3 className="text-2xl font-semibold">Pague su consulta</h3>
        <p className="text-sm text-suave">Elija cómo desea pagar. Puede hacerlo ahora con tarjeta o al llegar a la clínica.</p>
      </header>

      {cargando && !metodos ? (
        <Spinner mensaje="Cargando métodos de pago…" />
      ) : errorMetodos ? (
        <Alert variante="error">{errorMetodos}</Alert>
      ) : (
        <div role="radiogroup" aria-label="Método de pago" className="grid gap-3 sm:grid-cols-2">
          {metodos.map((opcion) => (
            <OpcionTarjeta
              key={opcion.id}
              seleccionada={idMetodo === opcion.id}
              onSeleccionar={() => {
                setIdMetodo(opcion.id)
                setError('')
              }}
              disabled={enviando}
            >
              <span className="flex items-center gap-2 font-semibold">
                {opcion.nombre}
                {opcion.en_linea && (
                  <span className="rounded-full border border-borde px-2 py-0.5 text-[11px] font-medium text-suave">En línea</span>
                )}
              </span>
              {opcion.descripcion && <span className="text-sm text-suave">{opcion.descripcion}</span>}
            </OpcionTarjeta>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie-subtil p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-suave">Total a pagar</span>
          <span className="text-3xl font-bold tabular-nums">{formatearMoneda(monto)}</span>
        </div>

        {metodo?.en_linea ? (
          // key: si cambia de método y vuelve, se prepara el cobro de nuevo (el servidor reutiliza el intento).
          <PagoConTarjeta key={metodo.id} cita={cita} idEspecialidad={especialidad.id} onPagado={onPagado} />
        ) : (
          <>
            {metodo && (
              <p className="text-xs text-suave">
                {esPagoEnRecepcion(metodo)
                  ? 'Su pago quedará pendiente hasta que lo abone en recepción.'
                  : 'Su pago quedará pendiente hasta que recepción verifique la transferencia o el QR.'}
              </p>
            )}
            {error && <Alert variante="error">{error}</Alert>}
            <Button bloque onClick={registrarPendiente} disabled={!metodo} cargando={enviando}>
              {metodo ? 'Confirmar método de pago' : 'Elija un método de pago'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
