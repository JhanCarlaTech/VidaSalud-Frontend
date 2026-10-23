import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { useRoles } from '../../hooks/useRoles'
import { useUsuarios } from '../../hooks/useUsuarios'

const FILTROS_INICIALES = { buscar: '', rol: '', activo: '' }

/**
 * Lógica de la página de usuarios (CU02): filtros, paginación, modales
 * de alta/edición/cambio de estado y avisos de resultado.
 */
export function useUsuariosPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'formulario', usuario: object | null } | { tipo: 'estado', usuario: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  // Solo los roles activos se pueden filtrar y asignar (CU03, RN04).
  const { roles } = useRoles({ soloActivos: true })
  const { usuarios, meta, cargando, error, recargar } = useUsuarios({
    buscar,
    rol: filtros.rol,
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

  /** Se ejecuta tras guardar o cambiar el estado con éxito. */
  function finalizarOperacion(mensaje) {
    setModal(null)
    setAviso(mensaje)
    recargar()
  }

  return {
    filtros,
    hayFiltros: Object.values(filtros).some(Boolean),
    roles,
    usuarios,
    meta,
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros,
    cambiarPagina: setPagina,
    abrirNuevo: () => setModal({ tipo: 'formulario', usuario: null }),
    abrirEdicion: (usuario) => setModal({ tipo: 'formulario', usuario }),
    abrirCambioEstado: (usuario) => setModal({ tipo: 'estado', usuario }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
