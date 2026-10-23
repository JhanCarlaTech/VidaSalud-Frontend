import { useState } from 'react'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { useDebounce } from '../../../../../shared/hooks/useDebounce'
import { usePacientes } from '../../../../ModuloPacientes/hooks/usePacientes'

const RESULTADOS_VISIBLES = 5

/**
 * Paso 1 del personal (CU13): buscar y elegir un paciente activo (CU11).
 */
export function PasoPaciente({ paciente, onElegir }) {
  const [busqueda, setBusqueda] = useState('')
  const buscar = useDebounce(busqueda.trim())
  const { pacientes, cargando } = usePacientes({ buscar, activo: '1' })

  if (paciente) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-md border border-primario bg-white p-4">
        <div className="flex flex-col">
          <span className="font-semibold">{paciente.usuario.nombre_completo}</span>
          <span className="text-sm text-suave">
            {paciente.codigo} · CI {paciente.usuario.ci} · {paciente.edad} años
          </span>
        </div>
        <Button variante="secundario" tamano="sm" onClick={() => onElegir(null)}>
          Cambiar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        etiqueta="Buscar paciente"
        type="search"
        placeholder="CI, nombre o código"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      {cargando && pacientes.length === 0 ? (
        <Spinner mensaje="Buscando…" />
      ) : pacientes.length === 0 ? (
        <p className="text-sm text-suave">No se encontraron pacientes activos. Regístrelo primero en Pacientes.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-borde rounded-md border border-borde bg-white">
          {pacientes.slice(0, RESULTADOS_VISIBLES).map((resultado) => (
            <li key={resultado.id}>
              <button
                type="button"
                onClick={() => onElegir(resultado)}
                className="flex w-full cursor-pointer flex-col items-start px-4 py-3 text-left hover:bg-superficie"
              >
                <span className="font-medium">{resultado.usuario.nombre_completo}</span>
                <span className="text-sm text-suave">
                  {resultado.codigo} · CI {resultado.usuario.ci}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
