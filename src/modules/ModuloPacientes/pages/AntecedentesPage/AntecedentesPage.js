import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { obtenerAntecedentes } from '../../services/enfermedades.service'

/**
 * Lógica de los antecedentes del paciente (CU12). El paciente elegido va en la URL
 * (?paciente=ID), así se puede llegar desde la página de pacientes y recargar sin perderlo.
 */
export function useAntecedentesPage() {
  const [parametros, setParametros] = useSearchParams()
  // modal = null | { tipo: 'formulario', antecedente: object | null } | { tipo: 'eliminar', antecedente: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()

  const idPaciente = Number(parametros.get('paciente')) || null
  const { datos, cargando, error, recargar } = useConsulta(
    () => (idPaciente ? obtenerAntecedentes(idPaciente) : Promise.resolve(null)),
    String(idPaciente),
  )

  function finalizarOperacion(mensaje) {
    setModal(null)
    setAviso(mensaje)
    recargar()
  }

  // Al cambiar de paciente, la respuesta anterior se descarta hasta que llega la nueva.
  const vigentes = datos?.paciente?.id === idPaciente ? datos : null
  const antecedentes = vigentes?.antecedentes ?? []

  return {
    idPaciente,
    paciente: vigentes?.paciente ?? null,
    antecedentes,
    registradas: antecedentes.map((antecedente) => antecedente.enfermedad.id),
    cargando: idPaciente !== null && cargando,
    error,
    aviso,
    modal,
    elegirPaciente: (paciente) => setParametros({ paciente: String(paciente.id) }),
    cambiarPaciente: () => setParametros({}),
    abrirNuevo: () => setModal({ tipo: 'formulario', antecedente: null }),
    abrirEdicion: (antecedente) => setModal({ tipo: 'formulario', antecedente }),
    abrirEliminacion: (antecedente) => setModal({ tipo: 'eliminar', antecedente }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
