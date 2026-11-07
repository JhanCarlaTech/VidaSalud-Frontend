const VARIANTES = {
  // Estados con significado (citas, pagos, riesgo, correos)
  primario: 'border-primario/20 bg-primario-suave text-primario',
  exito: 'border-exito/20 bg-exito-fondo text-exito',
  advertencia: 'border-advertencia/20 bg-advertencia-fondo text-advertencia',
  peligro: 'border-peligro/20 bg-peligro-fondo text-peligro',
  // Etiquetas sin estado
  solido: 'border-primario bg-primario text-sobre-primario',
  neutro: 'border-borde bg-superficie-subtil text-texto',
  contorno: 'border-borde bg-superficie text-suave',
}

/**
 * Etiqueta compacta (píldora) para estados y categorías. El color nunca va
 * solo: el texto siempre dice el estado.
 * @param {'primario' | 'exito' | 'advertencia' | 'peligro' | 'solido' | 'neutro' | 'contorno'} variante
 */
export function Badge({ variante = 'neutro', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap ${VARIANTES[variante] ?? VARIANTES.neutro}`}
    >
      {children}
    </span>
  )
}
