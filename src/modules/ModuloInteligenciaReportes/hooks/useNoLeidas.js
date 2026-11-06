import { useEffect, useState } from 'react'
import { contarNoLeidas, EVENTO_NOTIFICACIONES_LEIDAS } from '../services/notificaciones.service'

/** Cada cuánto se vuelve a consultar el contador (las notificaciones las crea el servidor). */
const INTERVALO_MS = 60_000

/**
 * Notificaciones sin leer del paciente, para la insignia del menú (CU20).
 * Se actualiza cada minuto, al volver a la pestaña y al leer notificaciones.
 * @param {boolean} activo  Solo consulta si el usuario es paciente.
 */
export function useNoLeidas(activo) {
  const [cantidad, setCantidad] = useState(0)

  useEffect(() => {
    if (!activo) return undefined
    let vigente = true

    // Un fallo de red no debe molestar: se reintenta en el siguiente ciclo.
    const actualizar = () =>
      contarNoLeidas()
        .then((valor) => vigente && setCantidad(valor))
        .catch(() => {})
    const alVolver = () => document.visibilityState === 'visible' && actualizar()

    actualizar()
    const intervalo = setInterval(actualizar, INTERVALO_MS)
    window.addEventListener(EVENTO_NOTIFICACIONES_LEIDAS, actualizar)
    document.addEventListener('visibilitychange', alVolver)

    return () => {
      vigente = false
      clearInterval(intervalo)
      window.removeEventListener(EVENTO_NOTIFICACIONES_LEIDAS, actualizar)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [activo])

  return activo ? cantidad : 0
}
