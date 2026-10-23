import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useAuth } from '../../../ModuloSeguridad/hooks/useAuth'
import { useHorarios } from '../../hooks/useHorarios'

/**
 * Lógica de la página de horarios (CU09). Con ':id' en la ruta el Administrador
 * gestiona la grilla de ese médico; sin él, el Médico gestiona la suya (RN05).
 */
export function useHorariosPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const esPropia = id === undefined
  const idMedico = esPropia ? usuario.id : Number(id)

  const { medico, horarios, cargando, error, recargar } = useHorarios(idMedico)
  // modal = null | { tipo: 'formulario', horario: object | null, dia: number } | { tipo: 'eliminar', horario: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  function finalizarOperacion(mensaje) {
    setModal(null)
    setAviso(mensaje)
    recargar()
  }

  return {
    idMedico,
    esPropia,
    medico,
    horarios,
    cargando,
    error,
    aviso,
    modal,
    abrirNuevo: (dia) => setModal({ tipo: 'formulario', horario: null, dia }),
    abrirEdicion: (horario) => setModal({ tipo: 'formulario', horario, dia: horario.dia_semana }),
    abrirEliminacion: (horario) => setModal({ tipo: 'eliminar', horario }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
