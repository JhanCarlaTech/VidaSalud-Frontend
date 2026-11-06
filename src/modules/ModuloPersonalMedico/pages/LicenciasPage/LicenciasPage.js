import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { listarLicencias, listarMedicosLicencias } from '../../services/licencias.service'

/**
 * Lógica de la página de licencias (CU10).
 * @param {boolean} propias  true en "Mis licencias" del Médico; false para el Administrador,
 *                           que ve las de todos y puede filtrar por médico (?medico=ID).
 */
export function useLicenciasPage(propias) {
  const [parametros, setParametros] = useSearchParams()
  const [periodo, setPeriodo] = useState('actuales')
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'formulario', licencia: object | null } | { tipo: 'eliminar' | 'citas', licencia: object }
  //       | { tipo: 'resultado', mensaje: string, citas: object[] }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso(6000)

  const medico = propias ? '' : (parametros.get('medico') ?? '')

  const medicos = useConsulta(() => (propias ? Promise.resolve(null) : listarMedicosLicencias()), String(propias))
  const listado = useConsulta(() => listarLicencias({ medico, periodo, page: pagina }), JSON.stringify([medico, periodo, pagina]))

  function cambiarMedico(evento) {
    const valor = evento.target.value
    setParametros(valor ? { medico: valor } : {}, { replace: true })
    setPagina(1)
  }

  function cambiarPeriodo(evento) {
    setPeriodo(evento.target.value)
    setPagina(1)
  }

  /**
   * Tras guardar: si quedaron citas pendientes dentro de la licencia (RN05) se muestran
   * en un diálogo que no desaparece solo, para que no pasen desapercibidas.
   */
  function finalizarGuardado(respuesta) {
    const citas = respuesta.data.citas_afectadas
    setModal(citas.length > 0 ? { tipo: 'resultado', mensaje: respuesta.message, citas } : null)
    if (citas.length === 0) setAviso(respuesta.message)
    listado.recargar()
  }

  function finalizarEliminacion(respuesta) {
    setModal(null)
    setAviso(respuesta.message)
    listado.recargar()
  }

  return {
    propias,
    medico,
    periodo,
    medicos: medicos.datos,
    licencias: listado.datos?.items ?? [],
    meta: listado.datos?.meta ?? null,
    cargando: listado.cargando,
    error: listado.error || medicos.error,
    aviso,
    modal,
    cambiarMedico,
    cambiarPeriodo,
    cambiarPagina: setPagina,
    abrirNueva: () => setModal({ tipo: 'formulario', licencia: null }),
    abrirEdicion: (licencia) => setModal({ tipo: 'formulario', licencia }),
    abrirEliminacion: (licencia) => setModal({ tipo: 'eliminar', licencia }),
    abrirCitas: (licencia) => setModal({ tipo: 'citas', licencia }),
    cerrarModal: () => setModal(null),
    finalizarGuardado,
    finalizarEliminacion,
  }
}
