import { useId } from 'react'

/**
 * Área de texto con etiqueta, contador opcional de caracteres y mensaje de
 * error accesible, con el mismo estilo que <Input>.
 */
export function Textarea({ etiqueta, error, id, maxLength, value = '', className = '', ...props }) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  const clases = [
    'min-h-24 w-full resize-y rounded-sm border bg-white px-4 py-3 text-base text-texto transition',
    'placeholder:text-sutil hover:border-sutil disabled:bg-gris',
    'focus:border-primario focus:ring-1 focus:ring-primario focus:outline-none',
    error ? 'border-peligro' : 'border-borde',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={idCampo} className="text-sm font-medium">
          {etiqueta}
        </label>
        {maxLength && (
          <span className="text-xs text-suave">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={idCampo}
        className={clases}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...props}
      />
      {error && (
        <p id={idError} className="text-xs text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
