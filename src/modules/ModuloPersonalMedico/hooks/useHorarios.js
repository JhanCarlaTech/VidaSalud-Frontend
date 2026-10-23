import { useConsulta } from '../../../shared/hooks/useConsulta'
import { obtenerDisponibilidad, obtenerHorarios } from '../services/horarios.service'

/** Datos básicos del médico y su grilla semanal (CU09). */
export function useHorarios(idMedico) {
  const { datos, cargando, error, recargar } = useConsulta(() => obtenerHorarios(idMedico), String(idMedico))

  return { medico: datos?.medico ?? null, horarios: datos?.horarios ?? [], cargando, error, recargar }
}

/**
 * Turnos de un médico en una fecha con su estado (CU09, RN06).
 * También lo usarán CU13 y CU14 para elegir un turno disponible.
 * Mientras falte el médico o la fecha no consulta y devuelve null.
 * @param {string} fecha  'AAAA-MM-DD'
 * @param {string} [actualizacion]  Al cambiar (p. ej., tras editar la grilla) se vuelve a calcular.
 */
export function useDisponibilidad(idMedico, fecha, actualizacion = '') {
  const { datos, cargando, error, recargar } = useConsulta(
    () => (idMedico && fecha ? obtenerDisponibilidad(idMedico, fecha) : Promise.resolve(null)),
    `${idMedico}|${fecha}|${actualizacion}`,
  )

  return { disponibilidad: datos, cargando, error, recargar }
}
