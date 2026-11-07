import { useState } from 'react'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { Toggle } from '../../../../../shared/components/ui/Toggle'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { formatearFechaHora } from '../../../../../shared/utils/formatters'
import { obtenerEvento } from '../../../services/bitacora.service'

/** Siglas y nombres que no se deducen del nombre de la columna. */
const ETIQUETAS_CAMPO = {
  ci: 'CI',
  id: 'ID',
  ip: 'IP',
  imc: 'IMC',
  hra_inicio: 'Hora de inicio',
  hra_fin: 'Hora de fin',
  nro_expediente: 'N.º de expediente',
}

/** 'contacto.nombre' → 'Contacto › Nombre'; 'id_cita' → 'Id cita'. */
function etiquetaCampo(campo) {
  return campo
    .split('.')
    .map((parte) => ETIQUETAS_CAMPO[parte] ?? parte.charAt(0).toUpperCase() + parte.slice(1).replaceAll('_', ' '))
    .join(' › ')
}

/** Valor registrado en un formato legible. */
function formatearValor(valor) {
  if (valor === null || valor === undefined || valor === '') return '—'
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  if (Array.isArray(valor)) {
    if (valor.length === 0) return 'Ninguno'
    return valor.every((elemento) => typeof elemento !== 'object') ? valor.join(', ') : JSON.stringify(valor)
  }
  if (typeof valor === 'object') return JSON.stringify(valor)
  return String(valor)
}

/** Dato del encabezado del evento. */
function Dato({ etiqueta, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  )
}

/** Tabla de campos: "Antes / Después" en una modificación, o un solo valor si hay un estado. */
function TablaCambios({ evento }) {
  const comparar = evento.datos_anteriores !== null && evento.datos_nuevos !== null
  const hayModificados = evento.cambios.some((cambio) => cambio.modificado)
  const [soloModificados, setSoloModificados] = useState(hayModificados)
  const filas = soloModificados ? evento.cambios.filter((cambio) => cambio.modificado) : evento.cambios
  const titulo = comparar ? 'Cambios registrados' : evento.datos_nuevos !== null ? 'Datos registrados' : 'Datos anteriores'

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{titulo}</h3>

      {comparar && hayModificados && (
        <Toggle etiqueta="Mostrar solo los campos modificados" activo={soloModificados} onCambiar={setSoloModificados} />
      )}
      {comparar && !hayModificados && <p className="text-sm text-suave">Ningún campo cambió de valor.</p>}

      <div className="overflow-x-auto rounded-xl border border-borde">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-borde bg-superficie-subtil">
            <tr>
              <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-suave uppercase">
                Campo
              </th>
              {comparar ? (
                <>
                  <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-suave uppercase">
                    Antes
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-suave uppercase">
                    Después
                  </th>
                </>
              ) : (
                <th scope="col" className="px-3 py-2 text-xs font-medium tracking-wider text-suave uppercase">
                  Valor
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filas.map((cambio) => (
              <tr key={cambio.campo} className={`border-b border-borde last:border-b-0 ${cambio.modificado ? 'bg-gris' : ''}`}>
                <th scope="row" className="px-3 py-2 align-top font-medium whitespace-nowrap">
                  {cambio.modificado && <span className="sr-only">Modificado: </span>}
                  {etiquetaCampo(cambio.campo)}
                </th>
                {comparar ? (
                  <>
                    <td className="px-3 py-2 align-top break-all text-suave">{formatearValor(cambio.anterior)}</td>
                    <td className={`px-3 py-2 align-top break-all ${cambio.modificado ? 'font-semibold' : ''}`}>{formatearValor(cambio.nuevo)}</td>
                  </>
                ) : (
                  <td className="px-3 py-2 align-top break-all">{formatearValor(cambio.nuevo ?? cambio.anterior)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Detalle de un evento de la bitácora (CU06, flujo 4): quién, qué, cuándo,
 * desde dónde y los datos registrados. Los valores sensibles llegan ocultos (RN05).
 */
export function DetalleEventoModal({ idEvento, onCerrar }) {
  const { datos: evento, error, cargando } = useConsulta(() => obtenerEvento(idEvento), String(idEvento))

  return (
    <Modal
      abierto
      titulo={`Evento #${idEvento}`}
      descripcion="Los registros de la bitácora no se pueden modificar ni eliminar."
      onCerrar={onCerrar}
      pie={
        <Button variante="secundario" onClick={onCerrar}>
          Cerrar
        </Button>
      }
    >
      {cargando && (
        <div className="grid place-items-center py-10">
          <Spinner mensaje="Cargando evento…" />
        </div>
      )}

      {!cargando && error && <Alert variante="error">{error}</Alert>}

      {!cargando && evento && (
        <div className="flex flex-col gap-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Dato etiqueta="Fecha y hora">{formatearFechaHora(evento.fecha)}</Dato>
            <Dato etiqueta="Acción">{evento.accion_etiqueta}</Dato>
            <Dato etiqueta="Usuario">
              {evento.usuario ? (
                <>
                  {evento.usuario.nombre_completo}
                  <span className="block text-suave">{evento.usuario.correo}</span>
                </>
              ) : (
                <>
                  Sin usuario identificado
                  {evento.correo_intento && <span className="block text-suave">Correo usado: {evento.correo_intento}</span>}
                </>
              )}
            </Dato>
            <Dato etiqueta="Módulo">{evento.tabla_etiqueta}</Dato>
            <Dato etiqueta="IP de origen">{evento.ip}</Dato>
            <Dato etiqueta="Código de acción">
              <code className="font-mono text-xs">{evento.accion}</code> sobre <code className="font-mono text-xs">{evento.tabla}</code>
            </Dato>
          </dl>

          {evento.cambios.length > 0 ? (
            <TablaCambios evento={evento} />
          ) : (
            <p className="text-sm text-suave">Este evento no registra datos adicionales.</p>
          )}
        </div>
      )}
    </Modal>
  )
}
