import { formatearValor } from '../../utils/reportes'

const PORCENTAJE = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1, signDisplay: 'exceptZero' })

/**
 * Indicador del tablero (CU23): etiqueta, valor y variación frente al periodo anterior.
 * La variación se lee con flecha y texto, no solo con color: se marca en rojo solo
 * cuando empeora (según si para ese indicador es mejor que suba o que baje).
 *
 * @param {{ etiqueta: string, valor: number|null, formato: string, mejor: 'sube'|'baja',
 *   variacion: { valor: number, unidad: 'puntos'|'porcentaje' } | null }} indicador
 */
export function Indicador({ indicador }) {
  const { variacion } = indicador
  const sube = variacion && variacion.valor > 0
  const baja = variacion && variacion.valor < 0
  const empeora = (sube && indicador.mejor === 'baja') || (baja && indicador.mejor === 'sube')

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-borde bg-superficie px-4 py-3">
      <span className="text-sm text-suave">{indicador.etiqueta}</span>
      {/* Cifras proporcionales en el valor grande (no tabulares). */}
      <span className="text-2xl font-semibold [overflow-wrap:anywhere] 2xl:text-3xl">{formatearValor(indicador.valor, indicador.formato)}</span>
      <span className={`text-xs ${empeora ? 'text-peligro' : 'text-suave'}`}>
        {variacion === null ? (
          'Sin datos para comparar'
        ) : (
          <>
            <span aria-hidden="true">{sube ? '▲ ' : baja ? '▼ ' : '= '}</span>
            {variacion.unidad === 'puntos'
              ? `${PORCENTAJE.format(variacion.valor)} puntos`
              : `${PORCENTAJE.format(variacion.valor)} %`}{' '}
            vs. periodo anterior
            {empeora && <span className="sr-only"> (empeora)</span>}
          </>
        )}
      </span>
    </div>
  )
}
