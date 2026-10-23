import { useId } from 'react'

/**
 * Interruptor tipo cápsula blanco y negro (Diseño frontend.md), con etiqueta
 * y descripción. Accesible como role="switch".
 */
export function Toggle({ etiqueta, descripcion, activo, onCambiar, disabled = false }) {
  const idEtiqueta = useId()
  const idDescripcion = useId()

  return (
    <div className="flex items-center justify-between gap-4 rounded-sm border border-borde px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span id={idEtiqueta} className="text-sm font-medium">
          {etiqueta}
        </span>
        {descripcion && (
          <span id={idDescripcion} className="text-xs text-suave">
            {descripcion}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-labelledby={idEtiqueta}
        aria-describedby={descripcion ? idDescripcion : undefined}
        onClick={() => onCambiar(!activo)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${activo ? 'bg-primario' : 'bg-borde'}`}
      >
        <span
          aria-hidden="true"
          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${activo ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}
