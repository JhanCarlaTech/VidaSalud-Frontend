/** '1200 × 900' → { ancho: 1200, alto: 900 } (para que el navegador reserve el espacio). */
function medidas(tamano) {
  const [ancho, alto] = (tamano ?? '').split('×').map((valor) => Number.parseInt(valor, 10))
  return Number.isFinite(ancho) && Number.isFinite(alto) ? { ancho, alto } : {}
}

/**
 * Imagen de la página principal. Sin `src` muestra un espacio reservado que
 * indica qué foto va ahí y su tamaño recomendado (ver IMAGENES_SITIO).
 * @param {string | null} src
 * @param {string} descripcion  Texto alternativo y rótulo del espacio reservado.
 * @param {string} [tamano]     Tamaño de la imagen, p. ej. '1200 × 900'.
 * @param {boolean} [prioridad] Imagen visible al cargar (la portada): se descarga primero y sin espera.
 */
export function EspacioImagen({ src, descripcion, tamano, prioridad = false, className = '' }) {
  if (src) {
    const { ancho, alto } = medidas(tamano)
    return (
      <img
        src={src}
        alt={descripcion}
        width={ancho}
        height={alto}
        loading={prioridad ? 'eager' : 'lazy'}
        fetchPriority={prioridad ? 'high' : 'auto'}
        decoding="async"
        className={`h-full w-full rounded-xl border border-borde bg-superficie-subtil object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`Espacio para imagen: ${descripcion}`}
      className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-sutil bg-gris p-6 text-center text-suave ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5-9 9" />
      </svg>
      <span className="text-sm font-medium">{descripcion}</span>
      {tamano && <span className="text-xs text-sutil">{tamano} px</span>}
    </div>
  )
}
