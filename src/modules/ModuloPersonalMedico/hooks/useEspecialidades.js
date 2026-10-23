import { useConsulta } from '../../../shared/hooks/useConsulta'
import { listarEspecialidades } from '../services/especialidades.service'

/**
 * Catálogo de especialidades; se vuelve a consultar cuando cambian los filtros.
 * También lo usarán CU08 (asignar especialidades) y CU13 (reservar citas) con { activo: '1' }.
 * @param {{ buscar?: string, activo?: '1' | '0' | '' }} filtros
 */
export function useEspecialidades({ buscar = '', activo = '' } = {}) {
  const { datos, cargando, error, recargar } = useConsulta(
    () => listarEspecialidades({ buscar, activo }),
    `${buscar}|${activo}`,
  )

  return { especialidades: datos ?? [], cargando, error, recargar }
}
