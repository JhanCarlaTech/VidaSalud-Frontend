import { useEffect, useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { fechaISO } from '../../../../shared/utils/formatters'
import { obtenerAsistencia, registrarAsistencia } from '../../services/asistencia.service'

/** Cada minuto se actualiza la lista: las acciones dependen de la hora (p. ej., la tolerancia). */
const INTERVALO_ACTUALIZACION_MS = 60_000

/**
 * Lógica de la pantalla de asistencia (CU15): fecha, búsqueda, actualización
 * periódica y registro de cada transición.
 */
export function useAsistenciaPage() {
  const [fecha, setFecha] = useState(fechaISO())
  const [busqueda, setBusqueda] = useState('')
  const [procesando, setProcesando] = useState(null) // id de la cita en curso
  const [error, setError] = useState('')
  const [aviso, setAviso] = useAviso()

  const buscar = useDebounce(busqueda.trim())
  const { datos, cargando, error: errorCarga, recargar } = useConsulta(
    () => obtenerAsistencia({ fecha, buscar }),
    `${fecha}|${buscar}`,
  )

  useEffect(() => {
    const intervalo = setInterval(recargar, INTERVALO_ACTUALIZACION_MS)
    return () => clearInterval(intervalo)
  }, [recargar])

  /** Desplaza la fecha `dias` días respecto de la actual. */
  function moverFecha(dias) {
    setFecha((actual) => fechaISO(dias, new Date(`${actual}T00:00`)))
  }

  async function registrar(cita, estado) {
    setError('')
    setProcesando(cita.id)
    try {
      const respuesta = await registrarAsistencia(cita.id, estado)
      setAviso(respuesta.message)
      recargar()
    } catch (err) {
      setError(err.errors?.estado?.[0] ?? err.message)
      recargar() // Las acciones disponibles pudieron cambiar.
    } finally {
      setProcesando(null)
    }
  }

  return {
    fecha,
    esHoy: fecha === fechaISO(),
    busqueda,
    citas: datos?.citas ?? [],
    resumen: datos?.resumen ?? {},
    cargando,
    error: error || errorCarga,
    aviso,
    procesando,
    cambiarFecha: (nueva) => nueva && setFecha(nueva),
    irAHoy: () => setFecha(fechaISO()),
    diaAnterior: () => moverFecha(-1),
    diaSiguiente: () => moverFecha(1),
    cambiarBusqueda: (evento) => setBusqueda(evento.target.value),
    registrar,
  }
}
