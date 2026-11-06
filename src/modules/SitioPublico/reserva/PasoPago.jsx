import { useState } from 'react'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../shared/hooks/useConsulta'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { OpcionTarjeta } from '../../ModuloOperacionCitas/components/OpcionTarjeta'
import { listarMetodosPago, registrarPago } from '../../ModuloOperacionCitas/services/pago.service'

/** El pago en recepción se registra como pendiente; los pagos en línea, como completados. */
function esPagoEnRecepcion(metodo) {
  return /efectivo/i.test(metodo?.nombre ?? '')
}

/**
 * Etapa 'pago' (CU24): la cita ya está agendada y se cobra el precio de la
 * consulta de la especialidad elegida.
 */
export function PasoPago({ cita, monto, onPagado }) {
  const { datos: metodos, cargando, error: errorMetodos } = useConsulta(listarMetodosPago)
  const [idMetodo, setIdMetodo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const metodo = metodos?.find((m) => m.id === idMetodo)
  const enRecepcion = esPagoEnRecepcion(metodo)

  async function pagar() {
    setError('')
    setEnviando(true)
    try {
      const respuesta = await registrarPago({
        id_cita: cita.id,
        id_metodo_pago: idMetodo,
        monto,
        estado: enRecepcion ? 'Pendiente' : 'Completado',
      })
      onPagado({ ...respuesta.data, metodo: metodo.nombre })
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
        <p className="text-sm text-suave">Elija cómo desea pagar. Puede hacerlo ahora en línea o al llegar a la clínica.</p>
      </header>

      {cargando && !metodos ? (
        <Spinner mensaje="Cargando métodos de pago…" />
      ) : errorMetodos ? (
        <Alert variante="error">{errorMetodos}</Alert>
      ) : (
        <div role="radiogroup" aria-label="Método de pago" className="grid gap-3 sm:grid-cols-2">
          {metodos.map((opcion) => (
            <OpcionTarjeta key={opcion.id} seleccionada={idMetodo === opcion.id} onSeleccionar={() => setIdMetodo(opcion.id)}>
              <span className="font-semibold">{opcion.nombre}</span>
              {opcion.descripcion && <span className="text-sm text-suave">{opcion.descripcion}</span>}
            </OpcionTarjeta>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-md border border-borde bg-superficie p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-suave">Total a pagar</span>
          <span className="text-3xl font-bold tabular-nums">{formatearMoneda(monto)}</span>
        </div>
        {metodo && !enRecepcion && (
          <p className="text-xs text-suave">Pasarela de demostración: el pago se registra sin cobrar a una cuenta real.</p>
        )}
        {enRecepcion && <p className="text-xs text-suave">Su pago quedará pendiente hasta que lo abone en recepción.</p>}
        {error && <Alert variante="error">{error}</Alert>}
        <Button bloque onClick={pagar} disabled={!metodo} cargando={enviando}>
          {enRecepcion ? 'Confirmar pago en recepción' : `Pagar ${formatearMoneda(monto)}`}
        </Button>
      </div>
    </div>
  )
}
