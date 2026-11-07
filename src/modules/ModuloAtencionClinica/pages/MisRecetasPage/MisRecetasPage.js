import { useState } from 'react'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { listarMisRecetas } from '../../services/recetas.service'

/**
 * Lógica de "Mis recetas" (CU18, Paciente): sus recetas con búsqueda por
 * medicamento, médico o código de cita, y paginación.
 */
export function useMisRecetasPage() {
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)

  const termino = useDebounce(buscar.trim())
  const { datos, cargando, error } = useConsulta(
    () => listarMisRecetas({ buscar: termino, page: pagina }),
    JSON.stringify([termino, pagina]),
  )

  function cambiarBusqueda(evento) {
    setBuscar(evento.target.value)
    setPagina(1)
  }

  return {
    buscar,
    termino,
    recetas: datos?.items ?? [],
    meta: datos?.meta ?? null,
    cargando,
    error,
    cambiarBusqueda,
    cambiarPagina: setPagina,
  }
}
