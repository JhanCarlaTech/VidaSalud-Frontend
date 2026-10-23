import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { usePacientes } from '../../hooks/usePacientes'

const FILTROS_INICIALES = { buscar: '', activo: '' }

/**
 * Lógica de la página de pacientes (CU11, personal): filtros, paginación, modales y avisos.
 */
export function usePacientesPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'formulario', paciente: object | null } | { tipo: 'estado', paciente: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  const { pacientes, meta, cargando, error, recargar } = usePacientes({ buscar, activo: filtros.activo, page: pagina })

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
    hayFiltros: Object.values(filtros).some(Boolean),
    pacientes,
    meta,
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros,
    cambiarPagina: setPagina,
    abrirNuevo: () => setModal({ tipo: 'formulario', paciente: null }),
    abrirEdicion: (paciente) => setModal({ tipo: 'formulario', paciente }),
    abrirCambioEstado: (paciente) => setModal({ tipo: 'estado', paciente }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
