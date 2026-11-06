/** Niveles de riesgo del catálogo (Enfermedad::NIVELES_RIESGO), de menor a mayor. */
export const NIVELES_RIESGO = Object.freeze(['Bajo', 'Moderado', 'Alto', 'Crítico'])

/**
 * Estilo monocromático del nivel: los riesgos altos se destacan con fondo negro.
 * @type {Record<string, 'solido' | 'neutro' | 'contorno'>}
 */
export const VARIANTE_RIESGO = Object.freeze({
  Bajo: 'contorno',
  Moderado: 'neutro',
  Alto: 'solido',
  Crítico: 'solido',
})
