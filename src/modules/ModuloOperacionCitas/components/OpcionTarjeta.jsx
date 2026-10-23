/**
 * Tarjeta seleccionable (equivalente accesible a un botón de radio) para los
 * pasos del asistente de citas: especialidad, médico y modalidad.
 */
export function OpcionTarjeta({ seleccionada, onSeleccionar, disabled = false, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={seleccionada}
      onClick={onSeleccionar}
      disabled={disabled}
      className={`flex h-full w-full cursor-pointer flex-col items-start gap-1 rounded-md border bg-white p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        seleccionada ? 'border-primario ring-1 ring-primario' : 'border-borde hover:border-sutil'
      }`}
    >
      {children}
    </button>
  )
}
