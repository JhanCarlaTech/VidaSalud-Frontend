import { Link } from 'react-router-dom'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { formatearFechaHora } from '../../../../../shared/utils/formatters'
import { listarRecetasDeConsulta } from '../../../services/recetas.service'
import { rutaImprimir } from '../../../utils/recetas'

/**
 * Recetas ya emitidas en una consulta, con acceso a su versión imprimible (CU18).
 */
export function RecetasConsultaModal({ consulta, onCerrar }) {
  const { datos, error, cargando } = useConsulta(() => listarRecetasDeConsulta(consulta.id), String(consulta.id))
  const recetas = datos ?? []

  return (
    <Modal
      abierto
      titulo="Recetas emitidas"
      descripcion={`${consulta.paciente.nombre_completo} · ${consulta.nro_expediente}`}
      onCerrar={onCerrar}
      pie={
        <Button variante="secundario" onClick={onCerrar}>
          Cerrar
        </Button>
      }
    >
      {cargando && <Spinner mensaje="Cargando recetas…" />}
      {error && <Alert variante="error">{error}</Alert>}
      {!cargando && !error && recetas.length === 0 && <p className="text-sm text-suave">Esta consulta aún no tiene recetas.</p>}

      <ul className="flex flex-col gap-3">
        {recetas.map((receta) => (
          <li key={receta.id} className="flex flex-col gap-2 rounded-sm border border-borde p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono font-semibold">{receta.numero}</p>
              <span className="text-sm text-suave">{formatearFechaHora(receta.fecha_emision)}</span>
            </div>
            <p className="text-sm">{receta.medicamentos.map((linea) => `${linea.medicamento} ${linea.dosis}`).join(' · ')}</p>
            <div>
              <Link
                to={rutaImprimir(receta.id)}
                className="inline-flex min-h-9 items-center rounded-sm border border-borde px-3 py-1.5 text-sm font-semibold hover:border-primario"
              >
                Ver e imprimir
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
