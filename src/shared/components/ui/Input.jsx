import { useId } from 'react'

/**
 * Campo de formulario con etiqueta, mensaje de error accesible y un
 * elemento opcional a la derecha (por ejemplo, "Mostrar" contraseña).
 */
export function Input({ etiqueta, error, adorno, id, className = '', ...props }) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  const clasesInput = [
    'min-h-11 w-full rounded-sm border bg-white px-4 py-3 text-base text-texto transition',
    'placeholder:text-sutil hover:border-sutil disabled:bg-gris',
    'focus:border-primario focus:ring-1 focus:ring-primario focus:outline-none',
    error ? 'border-peligro' : 'border-borde',
    adorno && 'pr-24',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={idCampo} className="text-sm font-medium">
        {etiqueta}
      </label>
      <div className="relative flex items-center">
        <input
          id={idCampo}
          className={clasesInput}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? idError : undefined}
          {...props}
        />
        {adorno && <div className="absolute right-2">{adorno}</div>}
      </div>
      {error && (
        <p id={idError} className="text-xs text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
