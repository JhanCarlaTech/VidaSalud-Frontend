/**
 * Indicador de carga.
 * @param {boolean} pantallaCompleta  Centra el indicador ocupando todo el espacio disponible.
 */
export function Spinner({ mensaje, pantallaCompleta = false }) {
  const contenedor = pantallaCompleta
    ? 'flex min-h-full flex-col items-center justify-center gap-4'
    : 'inline-flex items-center gap-2'

  return (
    <div role="status" className={contenedor}>
      <span aria-hidden="true" className="size-7 animate-spin rounded-full border-2 border-borde border-t-primario" />
      <p className={mensaje ? 'text-sm text-suave' : 'sr-only'}>{mensaje ?? 'Cargando…'}</p>
    </div>
  )
}
