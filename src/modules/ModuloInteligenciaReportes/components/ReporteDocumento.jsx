import { DataTable } from '../../../shared/components/ui/DataTable'
import { formatearDia, formatearFechaHora } from '../../../shared/utils/formatters'
import { esNumerica, formatearValor } from '../utils/reportes'

/** Columnas del servidor → columnas de DataTable con su formato. */
function columnasTabla(columnas) {
  return columnas.map((columna) => ({
    clave: columna.clave,
    titulo: columna.etiqueta,
    className: esNumerica(columna.formato) ? 'text-right tabular-nums whitespace-nowrap' : '',
    render: (fila) => formatearValor(fila[columna.clave], columna.formato),
  }))
}

/** Clases completas para que Tailwind las genere (no admite nombres armados en tiempo de ejecución). */
const COLUMNAS_INDICADORES = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }

/** Las filas no traen un identificador común: se numeran para React. */
const conClave = (filas) => filas.map((fila, indice) => ({ ...fila, _clave: indice }))

/**
 * Reporte de CU21 a partir de su estructura genérica: encabezado, indicadores,
 * tabla agrupada y detalle. Sirve igual para la pantalla, la impresión y CU22.
 *
 * @param {import('../services/reportes.service').Reporte} reporte
 * @param {string} [clinica]  Nombre que encabeza la versión impresa.
 */
export function ReporteDocumento({ reporte, clinica, cargando = false }) {
  const { agrupado, detalle } = reporte

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b border-borde pb-4">
        {clinica && <p className="text-sm font-semibold tracking-wider text-suave uppercase">{clinica}</p>}
        <h2 className="text-2xl font-semibold">{reporte.titulo}</h2>
        <p className="text-sm text-suave">{reporte.descripcion}</p>
        <p className="text-sm">
          <span className="font-medium">Periodo:</span> {formatearDia(reporte.periodo.desde, { dateStyle: 'medium' })} al{' '}
          {formatearDia(reporte.periodo.hasta, { dateStyle: 'medium' })}
          {reporte.filtros_aplicados.map((filtro) => (
            <span key={filtro.etiqueta}>
              {' · '}
              <span className="font-medium">{filtro.etiqueta}:</span> {filtro.valor}
            </span>
          ))}
          {reporte.alcance === 'personal' && <span> · Solo sus pacientes</span>}
        </p>
        <p className="text-xs text-suave">Generado el {formatearFechaHora(reporte.generado_en)}</p>
      </header>

      <section aria-label="Indicadores" className={`grid gap-3 sm:grid-cols-2 ${COLUMNAS_INDICADORES[reporte.resumen.length] ?? 'lg:grid-cols-4'} ${cargando ? 'opacity-60' : ''}`}>
        {reporte.resumen.map((indicador) => (
          <div key={indicador.clave} className="flex flex-col gap-1 rounded-xl border border-borde bg-superficie px-4 py-3 break-inside-avoid">
            <span className="text-xs font-medium tracking-wider text-suave uppercase">{indicador.etiqueta}</span>
            <span className="text-2xl font-semibold tabular-nums">{formatearValor(indicador.valor, indicador.formato)}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Por {agrupado.etiqueta.toLowerCase()}</h3>
        <DataTable
          columnas={columnasTabla(agrupado.columnas)}
          filas={conClave(agrupado.filas)}
          obtenerClave={(fila) => fila._clave}
          cargando={cargando}
          mensajeVacio="No hay datos en el periodo con estos filtros."
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">Detalle</h3>
          <span className="text-sm text-suave">
            {detalle.truncado
              ? `Se muestran ${detalle.filas.length.toLocaleString('es-BO')} de ${detalle.total.toLocaleString('es-BO')} filas; exporte el detalle para verlas todas.`
              : `${detalle.total.toLocaleString('es-BO')} ${detalle.total === 1 ? 'fila' : 'filas'}`}
          </span>
        </div>
        <DataTable
          columnas={columnasTabla(detalle.columnas)}
          filas={conClave(detalle.filas)}
          obtenerClave={(fila) => fila._clave}
          cargando={cargando}
          mensajeVacio="No hay registros en el periodo con estos filtros."
        />
      </section>
    </article>
  )
}
