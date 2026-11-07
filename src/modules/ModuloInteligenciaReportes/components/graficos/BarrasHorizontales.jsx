import { useState } from 'react'
import { formatearValor } from '../../utils/reportes'

/**
 * Barras horizontales ordenadas de una sola serie (CU23): una barra de 16 px por
 * categoría, que crece desde una misma línea base, con el extremo de datos redondeado
 * y el valor en la punta (texto en tinta, nunca del color de la barra). Al pasar el
 * puntero o enfocarla con el teclado, cada barra muestra su detalle.
 *
 * @param {{ grupo: string, valor: number | null, detalle?: string }[]} filas  Ya ordenadas.
 * @param {number} [maximo]  Tope de la escala (100 para porcentajes); por defecto, el mayor valor.
 * @param {string} [sinValor]  Texto para las filas sin dato (por ejemplo, un médico sin horario).
 */
export function BarrasHorizontales({ filas, formato = 'numero', maximo, sinValor = 'Sin datos' }) {
  const [activa, setActiva] = useState(null)
  const tope = maximo ?? Math.max(0, ...filas.map((fila) => fila.valor ?? 0))

  if (filas.length === 0) return <p className="py-6 text-center text-sm text-suave">No hay datos en el periodo.</p>

  return (
    <ul className="flex flex-col gap-3">
      {filas.map((fila, indice) => {
        const proporcion = fila.valor && tope > 0 ? Math.max(0.01, fila.valor / tope) : 0
        const valorTexto = fila.valor === null ? sinValor : formatearValor(fila.valor, formato)

        return (
          <li
            key={fila.grupo}
            tabIndex={0}
            aria-label={`${fila.grupo}: ${valorTexto}${fila.detalle ? `, ${fila.detalle}` : ''}`}
            onPointerEnter={() => setActiva(indice)}
            onPointerLeave={() => setActiva(null)}
            onFocus={() => setActiva(indice)}
            onBlur={() => setActiva(null)}
            // En pantallas angostas el nombre va arriba y la barra usa todo el ancho.
            className="relative grid grid-cols-1 gap-1 rounded-lg py-1 outline-none focus-visible:ring-2 focus-visible:ring-primario sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center sm:gap-3"
          >
            <span className="truncate text-sm" title={fila.grupo}>
              {fila.grupo}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              {proporcion > 0 && (
                // Base cuadrada a la izquierda, extremo de datos redondeado (4 px). Se reservan
                // 7.5rem para que el valor más largo ("Bs 99.999,00") quepa en la punta sin recortarse.
                <span
                  aria-hidden="true"
                  className={`h-4 shrink-0 rounded-r-sm bg-primario transition-opacity ${activa === indice ? 'opacity-70' : ''}`}
                  style={{ width: `calc((100% - 7.5rem) * ${proporcion.toFixed(4)})` }}
                />
              )}
              <span className={`text-sm whitespace-nowrap ${fila.valor === null ? 'text-suave' : 'font-semibold'}`}>{valorTexto}</span>
            </span>

            {activa === indice && fila.detalle && (
              <span role="status" className="pointer-events-none absolute right-0 -top-7 z-10 rounded-lg border border-borde bg-superficie px-2 py-1 text-xs shadow-suave">
                {fila.detalle}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
