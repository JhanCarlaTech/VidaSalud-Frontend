/**
 * Marca de la clínica: cruz médica monocromática + nombre.
 * @param {boolean} invertido  Versión blanca para fondos negros.
 */
export function Logo({ invertido = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <rect width="32" height="32" rx="6" className={invertido ? 'fill-white' : 'fill-primario'} />
        <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" className={invertido ? 'fill-primario' : 'fill-white'} />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${invertido ? 'text-white' : 'text-texto'}`}>Vida Salud</span>
    </div>
  )
}
