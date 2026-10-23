import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useMisCitas } from '../../hooks/useCitas'

export const PERIODOS = [
  { clave: 'proximas', etiqueta: 'Próximas', vacio: 'No tiene citas próximas.' },
  { clave: 'historial', etiqueta: 'Historial', vacio: 'Aún no tiene citas anteriores.' },
]

/**
 * Lógica de "Mis citas" (CU13, flujo 7): citas próximas e historial del paciente,
 * con las acciones de reprogramar y cancelar (CU14).
 */
export function useMisCitasPage() {
  const [periodo, setPeriodo] = useState(PERIODOS[0].clave)
  // modal = null | { tipo: 'reprogramar' | 'cancelar', cita: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso()
  const { citas, cargando, error, recargar } = useMisCitas(periodo)

  function finalizarOperacion(mensaje) {
    setModal(null)
    setAviso(mensaje)
    recargar()
  }

  return {
    periodo,
    cambiarPeriodo: setPeriodo,
    citas,
    cargando,
    error,
    aviso,
    modal,
    abrirReprogramacion: (cita) => setModal({ tipo: 'reprogramar', cita }),
    abrirCancelacion: (cita) => setModal({ tipo: 'cancelar', cita }),
    cerrarModal: () => setModal(null),
    finalizarOperacion,
  }
}
