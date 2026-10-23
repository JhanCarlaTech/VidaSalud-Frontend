import { useConsulta } from '../../../shared/hooks/useConsulta'
import { listarCitas, listarDirectorioMedico, listarMisCitas, listarModalidades } from '../services/citas.service'

/**
 * Búsqueda paginada de citas para el personal (CU14); se repite al cambiar los filtros.
 * @param {{ buscar?: string, estado?: string, fecha?: string, periodo?: string, page?: number }} filtros
 */
export function useCitasGestion({ buscar = '', estado = '', fecha = '', periodo = 'proximas', page = 1 } = {}) {
  const { datos, cargando, error, recargar } = useConsulta(
    () => listarCitas({ buscar, estado, fecha, periodo, page }),
    JSON.stringify([buscar, estado, fecha, periodo, page]),
  )
  return { citas: datos?.items ?? [], meta: datos?.meta ?? null, cargando, error, recargar }
}

/** Catálogo de modalidades de cita (CU13, RN06). */
export function useModalidades() {
  const { datos, error } = useConsulta(listarModalidades)
  return { modalidades: datos ?? [], error }
}

/** Médicos activos de la especialidad elegida; sin especialidad no consulta. */
export function useDirectorioMedico(idEspecialidad) {
  const { datos, cargando, error } = useConsulta(
    () => (idEspecialidad ? listarDirectorioMedico(idEspecialidad) : Promise.resolve([])),
    String(idEspecialidad ?? ''),
  )
  return { medicos: datos ?? [], cargando, error }
}

/** Citas propias del paciente (CU13, flujo 7). @param {'proximas' | 'historial'} periodo */
export function useMisCitas(periodo) {
  const { datos, cargando, error, recargar } = useConsulta(() => listarMisCitas(periodo), periodo)
  return { citas: datos ?? [], cargando, error, recargar }
}
