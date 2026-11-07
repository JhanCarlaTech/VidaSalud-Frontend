/** Niveles de riesgo del catálogo (Enfermedad::NIVELES_RIESGO), de menor a mayor. */
export const NIVELES_RIESGO = Object.freeze(['Bajo', 'Moderado', 'Alto', 'Crítico'])

/**
 * Color del nivel de riesgo: verde, ámbar y rojo (el texto siempre dice el nivel).
 * @type {Record<string, 'exito' | 'advertencia' | 'peligro'>}
 */
export const VARIANTE_RIESGO = Object.freeze({
  Bajo: 'exito',
  Moderado: 'advertencia',
  Alto: 'peligro',
  Crítico: 'peligro',
})
