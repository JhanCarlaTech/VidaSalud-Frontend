import { useState } from 'react'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { esNumerica, formatearValor } from '../../utils/reportes'

/**
 * Tarjeta de un gráfico del tablero con su vista de tabla equivalente (CU23): ningún
 * valor depende solo del gráfico, del color o del cursor.
 *
 * @param {{ clave: string, etiqueta: string, formato: string }[]} columnas  Columnas de la tabla.
 * @param {object[]} filas  Mismos datos que el gráfico.
 */
export function PanelGrafico({ titulo, descripcion, columnas, filas, cargando = false, children }) {
  const [comoTabla, setComoTabla] = useState(false)

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-borde bg-superficie p-5" aria-busy={cargando || undefined}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">{titulo}</h2>
          {descripcion && <p className="text-xs text-suave">{descripcion}</p>}
        </div>
        <button
          type="button"
          onClick={() => setComoTabla(!comoTabla)}
          aria-pressed={comoTabla}
          className="shrink-0 cursor-pointer rounded-lg border border-borde px-2 py-1 text-xs font-medium hover:border-primario"
        >
          {comoTabla ? 'Ver gráfico' : 'Ver tabla'}
        </button>
      </header>

      {/* Al recargar se conserva el dibujo anterior atenuado, sin saltos. */}
      <div className={cargando ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
        {comoTabla ? (
          <DataTable
            columnas={columnas.map((columna) => ({
              clave: columna.clave,
              titulo: columna.etiqueta,
              className: esNumerica(columna.formato) ? 'text-right tabular-nums' : '',
              render: (fila) => formatearValor(fila[columna.clave], columna.formato),
            }))}
            filas={filas.map((fila, indice) => ({ ...fila, _clave: indice }))}
            obtenerClave={(fila) => fila._clave}
            mensajeVacio="No hay datos en el periodo."
          />
        ) : (
          children
        )}
      </div>
    </section>
  )
}
