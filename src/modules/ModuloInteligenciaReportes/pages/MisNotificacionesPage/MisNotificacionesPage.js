import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { listarMisNotificaciones, marcarLeida, marcarTodasLeidas } from '../../services/notificaciones.service'

/**
 * Lógica de la bandeja del paciente (CU20, RN07).
 */
export function useMisNotificacionesPage() {
  const [soloNoLeidas, setSoloNoLeidas] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [marcando, setMarcando] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const [aviso, setAviso] = useAviso()

  const { datos, cargando, error, recargar } = useConsulta(
    () => listarMisNotificaciones({ noLeidas: soloNoLeidas, page: pagina }),
    JSON.stringify([soloNoLeidas, pagina]),
  )

  function cambiarFiltro(valor) {
    setSoloNoLeidas(valor)
    setPagina(1)
  }

  async function ejecutar(clave, accion) {
    setMarcando(clave)
    setErrorAccion('')
    try {
      const respuesta = await accion()
      if (clave === 'todas') setAviso(respuesta.message)
      recargar()
    } catch (err) {
      setErrorAccion(err.message)
    } finally {
      setMarcando(null)
    }
  }

  return {
    soloNoLeidas,
    notificaciones: datos?.items ?? [],
    meta: datos?.meta ?? null,
    noLeidas: datos?.no_leidas ?? 0,
    cargando,
    error: error || errorAccion,
    aviso,
    marcando,
    cambiarFiltro,
    cambiarPagina: setPagina,
    marcar: (id) => ejecutar(id, () => marcarLeida(id)),
    marcarTodas: () => ejecutar('todas', marcarTodasLeidas),
  }
}
