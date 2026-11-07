import { useCallback, useEffect, useState } from 'react'
import {
  activarPush,
  desactivarPush,
  enviarPrueba,
  esIosSinInstalar,
  guardarSuscripcion,
  obtenerConfiguracionPush,
  pushSoportado,
  suscripcionActual,
} from '../services/push.service'

/**
 * Estado de las notificaciones push en este navegador (CU20):
 * - 'cargando'      consultando el navegador y la API
 * - 'no-disponible' el servidor no tiene claves VAPID configuradas
 * - 'no-soportado'  el navegador no admite push (o es iPhone sin instalar la web)
 * - 'bloqueado'     el usuario bloqueó las notificaciones para este sitio
 * - 'inactivo'      se puede activar
 * - 'activo'        este dispositivo recibe los avisos
 */
export function usePush() {
  const [estado, setEstado] = useState('cargando')
  const [clave, setClave] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState(null) // { tipo: 'info' | 'error', texto }

  useEffect(() => {
    let vigente = true

    async function revisar() {
      if (!pushSoportado()) return 'no-soportado'
      const configuracion = await obtenerConfiguracionPush()
      if (!configuracion.habilitado) return 'no-disponible'
      if (vigente) setClave(configuracion.clave_publica)
      if (Notification.permission === 'denied') return 'bloqueado'

      const suscripcion = await suscripcionActual()
      if (!suscripcion || Notification.permission !== 'granted') return 'inactivo'
      // Vuelve a vincular el dispositivo a la cuenta actual (otra persona pudo usar este navegador).
      await guardarSuscripcion(suscripcion)
      return 'activo'
    }

    revisar()
      .then((nuevo) => vigente && setEstado(nuevo))
      .catch(() => vigente && setEstado('inactivo'))

    return () => {
      vigente = false
    }
  }, [])

  const activar = useCallback(async () => {
    setOcupado(true)
    setMensaje(null)
    try {
      const resultado = await activarPush(clave)
      if (resultado === 'activado') {
        setEstado('activo')
        setMensaje({ tipo: 'info', texto: 'Listo: recibirá los avisos de sus citas en este dispositivo.' })
      } else if (resultado === 'denegado') {
        setEstado('bloqueado')
      } else {
        setMensaje({ tipo: 'info', texto: 'No se activaron los avisos. Puede intentarlo cuando quiera.' })
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'No se pudieron activar los avisos en este navegador.' })
    } finally {
      setOcupado(false)
    }
  }, [clave])

  const desactivar = useCallback(async () => {
    setOcupado(true)
    setMensaje(null)
    try {
      await desactivarPush()
      setEstado('inactivo')
      setMensaje({ tipo: 'info', texto: 'Este dispositivo ya no recibirá avisos.' })
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'No se pudieron desactivar los avisos.' })
    } finally {
      setOcupado(false)
    }
  }, [])

  const probar = useCallback(async () => {
    setOcupado(true)
    setMensaje(null)
    try {
      await enviarPrueba()
      setMensaje({ tipo: 'info', texto: 'Aviso de prueba enviado: debería aparecer en unos segundos.' })
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'No se pudo enviar el aviso de prueba.' })
    } finally {
      setOcupado(false)
    }
  }, [])

  return { estado, ocupado, mensaje, iosSinInstalar: estado === 'no-soportado' && esIosSinInstalar(), activar, desactivar, probar }
}
