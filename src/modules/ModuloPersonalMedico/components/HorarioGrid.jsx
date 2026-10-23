import { Button } from '../../../shared/components/ui/Button'
import { DIAS_SEMANA } from '../../../shared/utils/constants'

/**
 * Grilla semanal de atención (CU09): una columna por día con sus bloques.
 * En pantallas angostas los días se apilan.
 *
 * @param {object[]} horarios  Bloques con dia_semana, hora_inicio, hora_fin, duracion_minutos y turnos.
 * @param {boolean} editable   Muestra las acciones de agregar, editar y eliminar.
 */
export function HorarioGrid({ horarios, editable = false, onAgregar, onEditar, onEliminar }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
      {DIAS_SEMANA.map(({ valor, etiqueta }) => {
        const bloques = horarios.filter((horario) => horario.dia_semana === valor)
        const turnos = bloques.reduce((total, bloque) => total + bloque.turnos, 0)

        return (
          <section key={valor} aria-label={etiqueta} className="flex flex-col gap-3 rounded-md border border-borde bg-white p-3">
            <header className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold">{etiqueta}</h3>
              <span className="text-xs text-suave">{turnos > 0 ? `${turnos} turnos` : 'Sin atención'}</span>
            </header>

            <ul className="flex flex-1 flex-col gap-2">
              {bloques.map((bloque) => (
                <li key={bloque.id} className="flex flex-col gap-1 rounded-sm border border-borde bg-superficie p-2">
                  <span className="text-sm font-semibold tabular-nums">
                    {bloque.hora_inicio} – {bloque.hora_fin}
                  </span>
                  <span className="text-xs text-suave">
                    {bloque.duracion_minutos} min · {bloque.turnos} {bloque.turnos === 1 ? 'turno' : 'turnos'}
                  </span>
                  {editable && (
                    <div className="mt-1 flex gap-3">
                      <button type="button" onClick={() => onEditar(bloque)} className="cursor-pointer text-xs font-semibold text-suave hover:text-texto hover:underline">
                        Editar
                      </button>
                      <button type="button" onClick={() => onEliminar(bloque)} className="cursor-pointer text-xs font-semibold text-suave hover:text-texto hover:underline">
                        Eliminar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {editable && (
              <Button variante="secundario" tamano="sm" onClick={() => onAgregar(valor)}>
                Agregar
              </Button>
            )}
          </section>
        )
      })}
    </div>
  )
}
