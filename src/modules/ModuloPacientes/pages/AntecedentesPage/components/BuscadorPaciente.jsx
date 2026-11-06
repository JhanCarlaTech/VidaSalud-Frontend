import { useEffect, useState } from 'react'
import { Badge } from '../../../../../shared/components/ui/Badge'
import { Input } from '../../../../../shared/components/ui/Input'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { useDebounce } from '../../../../../shared/hooks/useDebounce'
import { buscarPacientes } from '../../../services/enfermedades.service'

const MINIMO_CARACTERES = 2

/**
 * Búsqueda de pacientes por CI, código o nombre (CU12, RN06: solo datos de identificación).
 * @param {(paciente: object) => void} onElegir
 */
export function BuscadorPaciente({ onElegir }) {
  const [texto, setTexto] = useState('')
  const termino = useDebounce(texto.trim())
  const [resultado, setResultado] = useState({ termino: '', pacientes: [], error: '' })

  const buscando = termino.length >= MINIMO_CARACTERES && resultado.termino !== termino

  useEffect(() => {
    if (termino.length < MINIMO_CARACTERES) return undefined
    let vigente = true

    buscarPacientes(termino)
      .then((pacientes) => vigente && setResultado({ termino, pacientes, error: '' }))
      .catch((err) => vigente && setResultado({ termino, pacientes: [], error: err.message }))

    return () => {
      vigente = false
    }
  }, [termino])

  const vigentes = resultado.termino === termino && termino.length >= MINIMO_CARACTERES

  return (
    <div className="flex flex-col gap-3">
      <Input
        etiqueta="Paciente"
        name="buscar"
        type="search"
        placeholder="CI, código (PAC-0001) o nombre"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        autoFocus
      />

      {buscando && <Spinner mensaje="Buscando…" />}
      {vigentes && resultado.error && <p className="text-sm text-peligro">{resultado.error}</p>}
      {vigentes && !resultado.error && resultado.pacientes.length === 0 && <p className="text-sm text-suave">Ningún paciente coincide con «{termino}».</p>}

      {vigentes && resultado.pacientes.length > 0 && (
        <ul className="flex flex-col divide-y divide-borde rounded-md border border-borde bg-white" aria-label="Pacientes encontrados">
          {resultado.pacientes.map((paciente) => (
            <li key={paciente.id}>
              <button
                type="button"
                onClick={() => onElegir(paciente)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-superficie"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{paciente.nombre_completo}</span>
                  <span className="text-sm text-suave">
                    {paciente.codigo} · CI {paciente.ci}
                    {paciente.edad !== null && ` · ${paciente.edad} años`}
                  </span>
                </span>
                {!paciente.activo && <Badge variante="contorno">Inactivo</Badge>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!vigentes && !buscando && <p className="text-sm text-suave">Escriba al menos {MINIMO_CARACTERES} caracteres para buscar.</p>}
    </div>
  )
}
