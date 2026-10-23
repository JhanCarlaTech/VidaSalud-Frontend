import { useConsulta } from '../../../shared/hooks/useConsulta'
import { listarMedicos } from '../services/medicos.service'

/**
 * Listado paginado de médicos; se vuelve a consultar cuando cambian los filtros.
 * Mientras llega la nueva respuesta se conservan las filas anteriores.
 * @param {{ buscar?: string, especialidad?: string, activo?: string, page?: number }} filtros
 */
export function useMedicos({ buscar = '', especialidad = '', activo = '', page = 1 } = {}) {
  const { datos, cargando, error, recargar } = useConsulta(
    () => listarMedicos({ buscar, especialidad, activo, page }),
    JSON.stringify([buscar, especialidad, activo, page]),
  )

  return { medicos: datos?.items ?? [], meta: datos?.meta ?? null, cargando, error, recargar }
}
