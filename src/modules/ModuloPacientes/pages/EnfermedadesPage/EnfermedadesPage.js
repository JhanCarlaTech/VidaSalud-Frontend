import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { listarEnfermedades } from '../../services/enfermedades.service'

const FILTROS_INICIALES = { buscar: '', nivel_riesgo: '', activo: '' }

/**
 * Lógica del catálogo de enfermedades (CU12): filtros, modales y avisos.
 */
export function useEnfermedadesPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  // modal = null | { tipo: 'formulario', enfermedad: object | null } | { tipo: 'estado', enfermedad: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(filtros.buscar.trim())
  const consulta = { buscar, nivel_riesgo: filtros.nivel_riesgo, activo: filtros.activo }
  const { datos, cargando, error, recargar } = useConsulta(() => listarEnfermedades(consulta), JSON.stringify(consulta))

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
    enfermedades: datos ?? [],
    cargando,
    error,
    aviso,
    modal,
    cambiarFiltro,
    limpiarFiltros: () => setFiltros(FILTROS_INICIALES),
    abrirNueva: () => setModal({ tipo: 'formulario', enfermedad: null }),
    abrirEdicion: (enfermedad) => setModal({ tipo: 'formulario', enfermedad }),
    abrirCambioEstado: (enfermedad) => setModal({ tipo: 'estado', enfermedad }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
