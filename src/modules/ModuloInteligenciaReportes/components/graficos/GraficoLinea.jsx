import { useId, useState } from 'react'
import { formatearDia } from '../../../../shared/utils/formatters'
import { formatearValor } from '../../utils/reportes'
import { escalaLimpia, useAncho } from './useAncho'

const ALTO = 220
const MARGEN = { arriba: 26, derecha: 16, abajo: 28, izquierda: 40 } // arriba: espacio para la etiqueta del máximo

/**
 * Línea de una sola serie a lo largo del tiempo (CU23), en el azul primario:
 * trazo de 2 px, área con degradado azul que se desvanece hacia el eje, cuadrícula de líneas finas y cursor que
 * se ajusta al día más cercano con su lectura. Se navega también con el teclado.
 *
 * @param {{ fecha: string, valor: number }[]} serie
 * @param {string} etiqueta  Nombre de la magnitud ("Atenciones"), para el lector y la ayuda.
 */
export function GraficoLinea({ serie, etiqueta, formato = 'numero' }) {
  const [contenedor, ancho] = useAncho()
  const [activo, setActivo] = useState(null)
  const idDegradado = useId()

  const internoAncho = ancho - MARGEN.izquierda - MARGEN.derecha
  const internoAlto = ALTO - MARGEN.arriba - MARGEN.abajo
  const valores = serie.map((punto) => punto.valor)
  const { maximo, paso } = escalaLimpia(Math.max(0, ...valores), { entero: formato === 'numero' })
  const marcas = Array.from({ length: Math.round(maximo / paso) + 1 }, (_, indice) => indice * paso)

  const x = (indice) => MARGEN.izquierda + (serie.length <= 1 ? internoAncho / 2 : (indice / (serie.length - 1)) * internoAncho)
  const y = (valor) => MARGEN.arriba + internoAlto - (valor / maximo) * internoAlto

  const linea = serie.map((punto, indice) => `${indice === 0 ? 'M' : 'L'}${x(indice).toFixed(1)},${y(punto.valor).toFixed(1)}`).join(' ')
  const area = serie.length > 0 ? `${linea} L${x(serie.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z` : ''

  // Etiqueta selectiva: solo el máximo del periodo.
  const indiceMaximo = valores.length ? valores.indexOf(Math.max(...valores)) : -1
  // Fechas del eje: inicio, medio y fin.
  const fechasEje = [...new Set([0, Math.floor((serie.length - 1) / 2), serie.length - 1])].filter((indice) => indice >= 0)

  function alMover(evento) {
    const caja = evento.currentTarget.getBoundingClientRect()
    const relativo = (evento.clientX - caja.left - MARGEN.izquierda) / internoAncho
    setActivo(Math.min(serie.length - 1, Math.max(0, Math.round(relativo * (serie.length - 1)))))
  }

  function alTeclado(evento) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return
    evento.preventDefault()
    setActivo((actual) => {
      const base = actual ?? serie.length - 1
      if (evento.key === 'Home') return 0
      if (evento.key === 'End') return serie.length - 1
      return Math.min(serie.length - 1, Math.max(0, base + (evento.key === 'ArrowRight' ? 1 : -1)))
    })
  }

  const puntoActivo = activo !== null ? serie[activo] : null
  const total = valores.reduce((suma, valor) => suma + valor, 0)

  return (
    // w-full + min-w-0: el ancho lo decide la tarjeta, nunca el SVG.
    <div ref={contenedor} className="relative w-full min-w-0" style={{ minHeight: ALTO }}>
      {ancho > 0 && (
      <svg
        width={ancho}
        height={ALTO}
        role="img"
        tabIndex={0}
        aria-label={`${etiqueta} por día: ${formatearValor(total, formato)} en total; máximo ${indiceMaximo >= 0 ? formatearValor(valores[indiceMaximo], formato) : 0}. Use las flechas para recorrer los días.`}
        onPointerMove={alMover}
        onPointerLeave={() => setActivo(null)}
        onKeyDown={alTeclado}
        onBlur={() => setActivo(null)}
        className="block rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-primario"
      >
        {/* Cuadrícula y eje Y */}
        {marcas.map((marca) => (
          <g key={marca}>
            <line x1={MARGEN.izquierda} x2={ancho - MARGEN.derecha} y1={y(marca)} y2={y(marca)} className="stroke-borde" strokeWidth="1" />
            <text x={MARGEN.izquierda - 8} y={y(marca)} dy="0.32em" textAnchor="end" className="fill-suave text-[11px] tabular-nums">
              {formatearValor(marca, formato)}
            </text>
          </g>
        ))}

        {/* Fechas del eje X */}
        {fechasEje.map((indice) => (
          <text
            key={indice}
            x={x(indice)}
            y={ALTO - 8}
            textAnchor={indice === 0 ? 'start' : indice === serie.length - 1 ? 'end' : 'middle'}
            className="fill-suave text-[11px]"
          >
            {formatearDia(serie[indice].fecha, { day: 'numeric', month: 'short' })}
          </text>
        ))}

        <defs>
          <linearGradient id={idDegradado} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--vs-primario)', stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: 'var(--vs-primario)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${CSS.escape(idDegradado)})`} />
        <path d={linea} fill="none" className="stroke-primario" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Máximo del periodo, con su valor */}
        {indiceMaximo >= 0 && valores[indiceMaximo] > 0 && activo === null && (
          <g>
            <circle cx={x(indiceMaximo)} cy={y(valores[indiceMaximo])} r="4" className="fill-primario stroke-superficie" strokeWidth="2" />
            <text x={x(indiceMaximo)} y={y(valores[indiceMaximo]) - 10} textAnchor="middle" className="fill-texto text-xs font-semibold">
              {formatearValor(valores[indiceMaximo], formato)}
            </text>
          </g>
        )}

        {/* Cursor: línea vertical en el día más cercano */}
        {puntoActivo && (
          <g pointerEvents="none">
            <line x1={x(activo)} x2={x(activo)} y1={MARGEN.arriba} y2={y(0)} className="stroke-suave" strokeWidth="1" />
            <circle cx={x(activo)} cy={y(puntoActivo.valor)} r="4" className="fill-primario stroke-superficie" strokeWidth="2" />
          </g>
        )}
      </svg>
      )}

      {puntoActivo && ancho > 0 && (
        <div
          role="status"
          className="pointer-events-none absolute top-2 flex -translate-x-1/2 flex-col rounded-lg border border-borde bg-superficie px-3 py-2 text-sm shadow-suave"
          style={{ left: Math.min(Math.max(x(activo), 70), ancho - 70) }}
        >
          <span className="font-semibold">{formatearValor(puntoActivo.valor, formato)}</span>
          <span className="text-xs text-suave">{formatearDia(puntoActivo.fecha, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>
      )}
    </div>
  )
}
