import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { useEspecialidades } from '../../hooks/useEspecialidades'
import { useMedicos } from '../../hooks/useMedicos'

const FILTROS_INICIALES = { buscar: '', especialidad: '', activo: '' }

/**
 * Lógica de la página de médicos (CU08): filtros, paginación, modales y avisos.
 */
export function useMedicosPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'formulario', medico: object | null } | { tipo: 'estado', medico: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  // Todas las especialidades: el formulario muestra también las inactivas ya asignadas (RN04).
  const { especialidades } = useEspecialidades()
  const { medicos, meta, cargando, error, recargar } = useMedicos({
    buscar,
    especialidad: filtros.especialidad,
    activo: filtros.activo,
    page: pagina,
  })

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
    especialidades,
    medicos,
    meta,
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros,
    cambiarPagina: setPagina,
    abrirNuevo: () => setModal({ tipo: 'formulario', medico: null }),
    abrirEdicion: (medico) => setModal({ tipo: 'formulario', medico }),
    abrirCambioEstado: (medico) => setModal({ tipo: 'estado', medico }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
