import { useState } from 'react'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../shared/hooks/useConsulta'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { listarMetodosPago, registrarPago } from '../services/pago.service'
import { OpcionTarjeta } from './OpcionTarjeta'
import { PagoConTarjeta } from './PagoConTarjeta'

function esPagoEnRecepcion(metodo) {
  return /efectivo/i.test(metodo?.nombre ?? '')
}

/**
 * CU24 – Pago de una cita: elección del método y cobro. Lo usan la reserva en
 * línea (página principal) y "Mis citas" (pagar después).
 * - Tarjeta: se cobra en el momento con Stripe.
 * - QR, transferencia o efectivo: queda pendiente hasta que recepción lo verifique.
 * El monto lo fija el servidor con el precio de la especialidad; aquí solo se muestra.
 *
 * @param {{ cita: { id: number }, especialidad: { id: number, precio_consulta: number }, onPagado: (pago: object) => void }} props
 */
export function PagoCita({ cita, especialidad, onPagado }) {
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
      const respuesta = await registrarPago({ id_cita: cita.id, id_metodo_pago: idMetodo, monto, id_especialidad: especialidad.id })
      onPagado(respuesta.data)
    } catch (err) {
      setError(err.errors ? Object.values(err.errors)[0][0] : err.message)
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
