import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { useEspecialidades } from '../../hooks/useEspecialidades'

const FILTROS_INICIALES = { buscar: '', activo: '' }

/**
 * Lógica de la página de especialidades (CU07): filtros, modales y avisos.
 */
export function useEspecialidadesPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  // modal = null | { tipo: 'formulario', especialidad: object | null } | { tipo: 'estado', especialidad: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  const { especialidades, cargando, error, recargar } = useEspecialidades({ buscar, activo: filtros.activo })

  function cambiarFiltro(evento) {
    const { name, value } = evento.target
    setFiltros((actuales) => ({ ...actuales, [name]: value }))
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
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros: () => setFiltros(FILTROS_INICIALES),
    abrirNueva: () => setModal({ tipo: 'formulario', especialidad: null }),
    abrirEdicion: (especialidad) => setModal({ tipo: 'formulario', especialidad }),
    abrirCambioEstado: (especialidad) => setModal({ tipo: 'estado', especialidad }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
