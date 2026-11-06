import { useState } from 'react'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { listarMisPacientes } from '../../services/historial.service'

/**
 * Lógica de "Mis pacientes" (CU19): los pacientes con los que el médico tiene
 * citas atendidas o pendientes (regla D4), con búsqueda y paginación.
 */
export function useMisPacientesPage() {
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)
  const termino = useDebounce(buscar.trim())

  const { datos, cargando, error } = useConsulta(() => listarMisPacientes({ buscar: termino, page: pagina }), JSON.stringify([termino, pagina]))

  function cambiarBusqueda(evento) {
    setBuscar(evento.target.value)
    setPagina(1)
  }

  return {
    buscar,
    pacientes: datos?.items ?? [],
    meta: datos?.meta ?? null,
    cargando,
    error,
    cambiarBusqueda,
    cambiarPagina: setPagina,
  }
}
