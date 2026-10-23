const VARIANTES = {
  primario: 'border-primario bg-primario text-white hover:enabled:bg-primario-hover',
  secundario: 'border-borde bg-white text-texto hover:enabled:border-primario',
}

const TAMANOS = {
  md: 'min-h-11 px-6 py-3',
  sm: 'min-h-9 px-3 py-1.5',
}

/**
 * Botón base del sistema.
 * @param {'primario' | 'secundario'} variante  Negro sólido o blanco con borde fino.
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
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border',
    'text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
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
