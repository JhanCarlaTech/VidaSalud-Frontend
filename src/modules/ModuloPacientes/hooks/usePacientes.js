import { useConsulta } from '../../../shared/hooks/useConsulta'
import { listarPacientes } from '../services/pacientes.service'

/**
 * Listado paginado de pacientes; se vuelve a consultar cuando cambian los filtros.
 * También lo usará CU13 para buscar al paciente al agendar una cita.
 * @param {{ buscar?: string, activo?: string, page?: number }} filtros
 */
export function usePacientes({ buscar = '', activo = '', page = 1 } = {}) {
  const { datos, cargando, error, recargar } = useConsulta(
    () => listarPacientes({ buscar, activo, page }),
    JSON.stringify([buscar, activo, page]),
  )

  return { pacientes: datos?.items ?? [], meta: datos?.meta ?? null, cargando, error, recargar }
}
