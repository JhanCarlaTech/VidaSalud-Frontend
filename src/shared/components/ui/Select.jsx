import { useId } from 'react'

/**
 * Lista desplegable con etiqueta y mensaje de error, con el mismo estilo que <Input>.
 * @param {{ valor: string | number, etiqueta: string }[]} opciones
 */
export function Select({ etiqueta, error, opciones, id, className = '', ...props }) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  const clases = [
    'min-h-11 w-full cursor-pointer rounded-sm border bg-white px-4 py-3 text-base text-texto transition',
    'hover:border-sutil disabled:cursor-not-allowed disabled:bg-gris',
    'focus:border-primario focus:ring-1 focus:ring-primario focus:outline-none',
    error ? 'border-peligro' : 'border-borde',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={idCampo} className="text-sm font-medium">
        {etiqueta}
      </label>
      <select
        id={idCampo}
        className={clases}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...props}
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {error && (
        <p id={idError} className="text-xs text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
