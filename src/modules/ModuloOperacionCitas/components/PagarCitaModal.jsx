import { useState } from 'react'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../shared/hooks/useConsulta'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { obtenerPagoCita } from '../services/pago.service'
import { fechaLarga } from '../utils/citas'
import { OpcionTarjeta } from './OpcionTarjeta'
import { PagoCita } from './PagoCita'

/** Mensaje para la página al terminar, según cómo quedó el pago. */
function mensajeFinal(cita, pago) {
  return pago.estado === 'Completado'
    ? `Pago de la cita ${cita.codigo} realizado: ${formatearMoneda(pago.monto)}.`
    : `Método de pago registrado para la cita ${cita.codigo} (${pago.metodo}). Queda pendiente hasta que recepción lo verifique.`
}

/**
 * CU24 – Pagar una cita ya reservada desde "Mis citas", igual que en la reserva en línea.
 * Las citas antiguas de médicos con varias especialidades piden primero la especialidad (define el precio).
 */
export function PagarCitaModal({ cita, onCerrar, onPagada }) {
  const { datos, cargando, error } = useConsulta(() => obtenerPagoCita(cita.id), String(cita.id))
  const [idElegida, setIdElegida] = useState(null)
  const [confirmada, setConfirmada] = useState(false)

  const opciones = datos?.especialidades ?? []
  const unica = opciones.length === 1 ? opciones[0] : null
  const especialidad = unica ?? (confirmada ? opciones.find((opcion) => opcion.id === idElegida) : null)
  const pendiente = datos?.pago?.estado === 'Pendiente' ? datos.pago : null

  return (
    <Modal
      abierto
      ancho="xl"
      titulo={`Pagar cita ${cita.codigo}`}
      descripcion={
        <span className="inline-block first-letter:uppercase">
          {fechaLarga(cita.fecha)}, {cita.hora_inicio} · {cita.medico.nombre_completo}
        </span>
      }
      onCerrar={onCerrar}
    >
      {cargando && !datos ? (
        <Spinner mensaje="Consultando el pago de la cita…" />
      ) : error ? (
        <Alert variante="error">{error}</Alert>
      ) : !datos.cobrable ? (
        <div className="flex flex-col items-start gap-4">
          <Alert>{datos.pago?.estado === 'Completado' ? 'Esta cita ya está pagada.' : `Una cita en estado ${cita.estado} no se puede pagar.`}</Alert>
          <Button variante="secundario" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      ) : opciones.length === 0 ? (
        <Alert variante="error">El médico de esta cita no tiene especialidades activas. Comuníquese con recepción.</Alert>
      ) : !especialidad ? (
        // Cita antigua: el médico atiende varias especialidades y no se guardó cuál se reservó.
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">¿Para qué especialidad es la consulta?</h3>
            <p className="text-sm text-suave">El precio depende de la especialidad. Quedará registrada en la cita.</p>
          </div>
          <div role="radiogroup" aria-label="Especialidad de la consulta" className="grid gap-3 sm:grid-cols-2">
            {opciones.map((opcion) => (
              <OpcionTarjeta key={opcion.id} seleccionada={idElegida === opcion.id} onSeleccionar={() => setIdElegida(opcion.id)}>
                <span className="flex w-full items-baseline justify-between gap-3">
                  <span className="font-semibold">{opcion.nombre}</span>
                  <span className="text-sm font-semibold tabular-nums">{formatearMoneda(opcion.precio_consulta)}</span>
                </span>
              </OpcionTarjeta>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setConfirmada(true)} disabled={!idElegida}>
              Continuar al pago
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-suave">
            Consulta de <span className="font-medium text-texto">{especialidad.nombre}</span>.
            {pendiente && ` Tiene un pago pendiente con ${pendiente.metodo}: puede pagar ahora con tarjeta o cambiar el método.`}
          </p>
          <PagoCita cita={cita} especialidad={especialidad} onPagado={(pago) => onPagada(mensajeFinal(cita, pago))} />
        </div>
      )}
    </Modal>
  )
}
