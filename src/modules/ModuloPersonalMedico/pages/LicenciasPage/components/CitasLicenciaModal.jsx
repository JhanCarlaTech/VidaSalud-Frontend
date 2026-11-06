import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { obtenerCitasDeLicencia } from '../../../services/licencias.service'
import { describirPeriodo } from '../../../utils/licencias'
import { CitasAfectadas } from './CitasAfectadas'

/**
 * Citas pendientes que quedaron dentro de una licencia (CU10, RN05).
 *
 * - Con `licencia`, las consulta al servidor (botón "Ver citas" del listado).
 * - Con `citas`, muestra las que devolvió el servidor al guardar.
 */
export function CitasLicenciaModal({ licencia = null, citas = null, mensaje = '', onCerrar }) {
  const consulta = useConsulta(() => (licencia ? obtenerCitasDeLicencia(licencia.id) : Promise.resolve(citas)), String(licencia?.id ?? ''))
  const lista = consulta.datos ?? []

  return (
    <Modal
      abierto
      titulo="Citas por reprogramar"
      descripcion={licencia ? `${licencia.medico.nombre_completo} · ${describirPeriodo(licencia)}` : undefined}
      onCerrar={onCerrar}
      pie={<Button onClick={onCerrar}>Entendido</Button>}
    >
      <div className="flex flex-col gap-4">
        {mensaje && <Alert>{mensaje}</Alert>}
        {consulta.cargando && <Spinner mensaje="Cargando citas…" />}
        {consulta.error && <Alert variante="error">{consulta.error}</Alert>}
        {!consulta.cargando && !consulta.error && lista.length === 0 && (
          <p className="text-sm text-suave">No quedan citas pendientes dentro de esta licencia.</p>
        )}
        <CitasAfectadas citas={lista} />
      </div>
    </Modal>
  )
}
