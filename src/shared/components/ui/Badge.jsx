const VARIANTES = {
  solido: 'border-primario bg-primario text-white',
  neutro: 'border-borde bg-gris text-texto',
  contorno: 'border-borde bg-white text-suave',
}

/**
 * Etiqueta compacta para estados y categorías.
 * @param {'solido' | 'neutro' | 'contorno'} variante
 */
export function Badge({ variante = 'neutro', children }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${VARIANTES[variante]}`}>
      {children}
    </span>
  )
}
