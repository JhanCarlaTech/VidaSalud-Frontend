import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { ejecutarRecordatorios, listarNotificaciones, reenviarNotificacion } from '../../services/notificaciones.service'

const FILTROS_INICIALES = { buscar: '', tipo: '', estado_correo: '', desde: '', hasta: '' }

/**
 * Lógica de la gestión de notificaciones de Recepción (CU20): filtros, avisos
 * manuales, reenvío de correos y envío inmediato de recordatorios.
 */
export function useNotificacionesPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  const [modalAviso, setModalAviso] = useState(false)
  const [procesando, setProcesando] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const [aviso, setAviso] = useAviso(6000)

  const buscar = useDebounce(filtros.buscar.trim())
  const errorRango = filtros.desde && filtros.hasta && filtros.hasta < filtros.desde ? 'La fecha final debe ser igual o posterior a la inicial.' : ''
  const consulta = { ...filtros, buscar }

  const { datos, cargando, error, recargar } = useConsulta(
    () => (errorRango ? Promise.resolve(null) : listarNotificaciones({ ...consulta, page: pagina })),
    JSON.stringify([consulta, pagina, errorRango]),
  )

  function cambiarFiltro(evento) {
    const { name, value } = evento.target
    setFiltros((actuales) => ({ ...actuales, [name]: value }))
    setPagina(1)
  }

  async function ejecutar(clave, accion) {
    setProcesando(clave)
    setErrorAccion('')
    try {
      const respuesta = await accion()
      setAviso(respuesta.message)
      recargar()
    } catch (err) {
      setErrorAccion(Object.values(err.errors ?? {})[0]?.[0] ?? err.message)
    } finally {
      setProcesando(null)
    }
  }

  function finalizarAviso(mensaje) {
    setModalAviso(false)
    setAviso(mensaje)
    recargar()
  }

  return {
    filtros,
    hayFiltros: Object.values(filtros).some(Boolean),
    errorRango,
    notificaciones: datos?.items ?? [],
    meta: datos?.meta ?? null,
    tipos: datos?.tipos ?? [],
    cargando,
    error: error || errorAccion,
    aviso,
    procesando,
    modalAviso,
    cambiarFiltro,
    limpiarFiltros: () => setFiltros(FILTROS_INICIALES),
    cambiarPagina: setPagina,
    reenviar: (id) => ejecutar(id, () => reenviarNotificacion(id)),
    enviarRecordatorios: () => ejecutar('recordatorios', ejecutarRecordatorios),
    abrirAviso: () => setModalAviso(true),
    cerrarAviso: () => setModalAviso(false),
    finalizarAviso,
  }
}
