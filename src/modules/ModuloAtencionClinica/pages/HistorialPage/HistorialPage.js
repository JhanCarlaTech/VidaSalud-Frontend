import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { obtenerHistorial, obtenerMiHistorial } from '../../services/historial.service'

/**
 * Lógica del historial clínico (CU19).
 * @param {boolean} propio  true en "Mi historial" del paciente; false para el médico (/medico/historial/:id).
 */
export function useHistorialPage(propio) {
  const { id } = useParams()
  const [pagina, setPagina] = useState(1)

  const { datos, error, cargando } = useConsulta(
    () => (propio ? obtenerMiHistorial(pagina) : obtenerHistorial(id, pagina)),
    JSON.stringify([propio, id, pagina]),
  )

  function cambiarPagina(nueva) {
    setPagina(nueva)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    propio,
    historial: datos,
    // Al pasar de página se conserva el historial anterior mientras llega el nuevo.
    cargandoInicial: cargando && !datos,
    cargandoConsultas: cargando && Boolean(datos),
    error,
    cambiarPagina,
  }
}
