/**
 * Marca de la clínica: cruz médica sobre el azul primario + nombre.
 * @param {boolean} invertido  Versión para los paneles de marca (bg-marca).
 */
export function Logo({ invertido = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <rect width="32" height="32" rx="8" className={invertido ? 'fill-sobre-marca' : 'fill-primario'} />
        <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" className={invertido ? 'fill-marca' : 'fill-sobre-primario'} />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${invertido ? 'text-sobre-marca' : 'text-texto'}`}>Vida Salud</span>
    </div>
  )
}
