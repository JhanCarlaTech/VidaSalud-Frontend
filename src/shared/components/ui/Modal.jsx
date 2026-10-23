import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Ventana modal accesible: se cierra con Escape o al pulsar fuera, bloquea
 * el desplazamiento del fondo y lleva el foco al diálogo al abrirse.
 * En móvil se muestra como hoja inferior.
 */
export function Modal({ abierto, titulo, descripcion, onCerrar, pie, children }) {
  const idTitulo = useId()
  const dialogo = useRef(null)
  // Referencia estable: el efecto de apertura no debe repetirse (y robar el foco) en cada render.
  const cerrar = useRef(onCerrar)

  useEffect(() => {
    cerrar.current = onCerrar
  })

  useEffect(() => {
    if (!abierto) return undefined

    const cerrarConEscape = (evento) => evento.key === 'Escape' && cerrar.current()
    const desbordeAnterior = document.body.style.overflow

    window.addEventListener('keydown', cerrarConEscape)
    document.body.style.overflow = 'hidden'
    dialogo.current?.focus()

    return () => {
      window.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = desbordeAnterior
    }
  }, [abierto])

  if (!abierto) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onMouseDown={(evento) => evento.target === evento.currentTarget && onCerrar()}
    >
      <div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-t-md bg-white shadow-suave outline-none sm:rounded-md"
      >
        <header className="flex items-start justify-between gap-4 border-b border-borde px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2 id={idTitulo} className="text-lg font-semibold">
              {titulo}
            </h2>
            {descripcion && <p className="text-sm text-suave">{descripcion}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-2 grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm text-suave hover:bg-gris hover:text-texto"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
              <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4z" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {pie && <footer className="flex flex-col-reverse gap-3 border-t border-borde px-6 py-4 sm:flex-row sm:justify-end">{pie}</footer>}
      </div>
    </div>,
    document.body,
  )
}
