/** Texto accesible del motivo por el que un turno no se puede elegir (CU09, RN06). */
const NO_DISPONIBLE = { ocupado: 'Ocupado', bloqueado: 'No atiende (licencia)', pasado: 'Ya pasó' }

/**
 * Selección de un turno del día (CU13, paso 4). Solo los turnos disponibles
 * se pueden elegir; los demás se muestran deshabilitados para dar contexto.
 *
 * @param {{ hora_inicio: string, hora_fin: string, estado: string }[]} turnos
 */
export function SlotPicker({ turnos, seleccionado, onSeleccionar, deshabilitado = false }) {
  const disponibles = turnos.filter((turno) => turno.estado === 'disponible').length

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-suave">
        {disponibles === 0
          ? 'No quedan turnos disponibles este día. Elija otra fecha.'
          : `${disponibles} ${disponibles === 1 ? 'turno disponible' : 'turnos disponibles'}`}
      </p>
      <div role="radiogroup" aria-label="Turnos del día" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {turnos.map((turno) => {
          const disponible = turno.estado === 'disponible'
          const elegido = seleccionado === turno.hora_inicio

          return (
            <button
              key={turno.hora_inicio}
              type="button"
              role="radio"
              aria-checked={elegido}
              aria-label={`${turno.hora_inicio} a ${turno.hora_fin}${disponible ? '' : `, ${NO_DISPONIBLE[turno.estado]}`}`}
              title={disponible ? `${turno.hora_inicio}–${turno.hora_fin}` : NO_DISPONIBLE[turno.estado]}
              disabled={!disponible || deshabilitado}
              onClick={() => onSeleccionar(turno.hora_inicio)}
              className={`rounded-sm border px-2 py-2 text-sm tabular-nums transition-colors ${
                elegido
                  ? 'border-primario bg-primario text-white'
                  : disponible
                    ? 'cursor-pointer border-borde bg-white hover:border-primario'
                    : 'cursor-not-allowed border-dashed border-borde bg-gris text-sutil line-through'
              }`}
            >
              {turno.hora_inicio}
            </button>
          )
        })}
      </div>
    </div>
  )
}
