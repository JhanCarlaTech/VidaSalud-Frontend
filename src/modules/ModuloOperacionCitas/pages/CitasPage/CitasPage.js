import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { useCitasGestion } from '../../hooks/useCitas'

const FILTROS_INICIALES = { buscar: '', estado: '', fecha: '', periodo: 'proximas' }

/**
 * Lógica de la gestión de citas del personal (CU14): búsqueda, filtros,
 * paginación y los modales de reprogramar y cancelar.
 */
export function useCitasPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'reprogramar' | 'cancelar', cita: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  const { citas, meta, cargando, error, recargar } = useCitasGestion({ ...filtros, buscar, page: pagina })

  function cambiarFiltro(evento) {
    const { name, value } = evento.target
    setFiltros((actuales) => ({ ...actuales, [name]: value }))
    setPagina(1)
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES)
    setPagina(1)
  }

  function finalizarOperacion(mensaje) {
    setModal(null)
    setAviso(mensaje)
    recargar()
  }

  return {
    filtros,
    hayFiltros: JSON.stringify(filtros) !== JSON.stringify(FILTROS_INICIALES),
    citas,
    meta,
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros,
    cambiarPagina: setPagina,
    abrirReprogramacion: (cita) => setModal({ tipo: 'reprogramar', cita }),
    abrirCancelacion: (cita) => setModal({ tipo: 'cancelar', cita }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
