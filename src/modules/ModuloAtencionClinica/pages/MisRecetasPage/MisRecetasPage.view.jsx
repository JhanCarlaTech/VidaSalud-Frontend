import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { formatearFechaHora } from '../../../../shared/utils/formatters'
import { rutaImprimir } from '../../utils/recetas'
import { useMisRecetasPage } from './MisRecetasPage'

/** Una receta: médico, fecha, medicamentos con su indicación y acceso a la versión imprimible. */
function TarjetaReceta({ receta }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-mono text-base font-semibold">{receta.numero}</h2>
            <Badge variante="primario">{receta.medicamentos.length === 1 ? '1 medicamento' : `${receta.medicamentos.length} medicamentos`}</Badge>
          </div>
          <p className="text-sm">
            {receta.medico.nombre_completo}
            {receta.medico.especialidades.length > 0 && <span className="text-suave"> · {receta.medico.especialidades.join(', ')}</span>}
          </p>
          <p className="text-xs text-suave">
            Emitida el {formatearFechaHora(receta.fecha_emision)} · Cita {receta.consulta.codigo_cita}
          </p>
        </div>
        <Link
          to={rutaImprimir(receta.id)}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-borde bg-superficie px-3 text-sm font-semibold transition-colors hover:bg-superficie-subtil"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v7H6z" />
          </svg>
          Ver e imprimir
          <span className="sr-only"> la receta {receta.numero} (se abre en otra pestaña)</span>
        </Link>
      </header>

      <ul className="flex flex-col divide-y divide-borde rounded-lg border border-borde">
        {receta.medicamentos.map((linea, indice) => (
          <li key={indice} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="font-medium">
              {linea.medicamento} <span className="font-normal text-suave">{linea.dosis}</span>
            </span>
            <span className="text-sm text-suave">
              {linea.frecuencia} · {linea.duracion_dias === 1 ? '1 día' : `${linea.duracion_dias} días`}
            </span>
          </li>
        ))}
      </ul>

      {receta.indicaciones_generales && (
        <p className="rounded-lg bg-superficie-subtil px-4 py-3 text-sm">
          <span className="font-medium">Indicaciones: </span>
          {receta.indicaciones_generales}
        </p>
      )}
    </article>
  )
}

/**
 * CU18 – Mis recetas (Paciente): todas las recetas emitidas en sus consultas.
 */
export function MisRecetasPage() {
  const pagina = useMisRecetasPage()

  return (
    <section className="flex max-w-4xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Mis recetas</h1>
        <p className="text-suave">Recetas que le emitieron sus médicos. Puede verlas e imprimirlas o guardarlas en PDF.</p>
      </header>

      <div className="max-w-md">
        <Input
          etiqueta="Buscar"
          type="search"
          value={pagina.buscar}
          onChange={pagina.cambiarBusqueda}
          placeholder="Medicamento, médico o código de cita"
        />
      </div>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      {pagina.cargando && pagina.recetas.length === 0 ? (
        <Spinner mensaje="Cargando recetas…" />
      ) : pagina.recetas.length === 0 ? (
        <p className="py-8 text-center text-suave">
          {pagina.termino ? 'No hay recetas que coincidan con la búsqueda.' : 'Todavía no tiene recetas. Aparecerán aquí después de sus consultas.'}
        </p>
      ) : (
        <ul className={`flex flex-col gap-4 ${pagina.cargando ? 'opacity-60' : ''}`}>
          {pagina.recetas.map((receta) => (
            <li key={receta.id}>
              <TarjetaReceta receta={receta} />
            </li>
          ))}
        </ul>
      )}

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />
    </section>
  )
}
