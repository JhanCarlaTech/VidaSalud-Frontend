const VARIANTES = {
  primario: 'border-primario bg-primario text-sobre-primario shadow-suave hover:enabled:border-primario-hover hover:enabled:bg-primario-hover',
  secundario: 'border-borde bg-superficie text-texto hover:enabled:bg-superficie-subtil',
  peligro: 'border-peligro bg-peligro text-sobre-peligro hover:enabled:opacity-90',
  fantasma: 'border-transparent bg-transparent text-suave hover:enabled:bg-superficie-subtil hover:enabled:text-primario',
}

const TAMANOS = {
  md: 'min-h-11 px-6 py-3',
  sm: 'min-h-9 px-3 py-1.5',
}

/**
 * Botón base del sistema.
 * @param {'primario' | 'secundario' | 'peligro' | 'fantasma'} variante
 *   Azul sólido, superficie con borde fino, rojo para acciones destructivas o transparente.
 * @param {'md' | 'sm'} tamano  'sm' para acciones dentro de tablas.
 * @param {boolean} bloque    Ocupa todo el ancho disponible.
 * @param {boolean} cargando  Muestra un indicador y deshabilita el botón.
 */
export function Button({
  variante = 'primario',
  tamano = 'md',
  bloque = false,
  cargando = false,
  type = 'button',
  disabled,
  className = '',
  children,
  ...props
}) {
  const clases = [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border',
    'text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario focus-visible:ring-offset-2 focus-visible:ring-offset-fondo',
    VARIANTES[variante],
    TAMANOS[tamano],
    bloque && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={clases} disabled={disabled || cargando} aria-busy={cargando || undefined} {...props}>
      {cargando && (
        <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  )
}
