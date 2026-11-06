import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { descargarArchivo } from '../../../../shared/utils/archivos'
import { RUTAS } from '../../../../shared/utils/constants'
import { useDictado, useLectura } from '../../hooks/useVoz'
import { exportarReporte, parametrosReporte } from '../../services/reportes.service'
import { consultarPorVoz } from '../../services/voz.service'

export const EJEMPLOS = [
  'Citas canceladas del mes pasado por médico',
  'Ingresos de octubre por método de pago',
  'Inasistencias de los últimos 90 días por especialidad',
  'Atenciones de esta semana por día',
]

/**
 * Lógica de los reportes por voz (CU22): dictar o escribir la consulta, enviarla,
 * mostrar qué se entendió con el reporte, y leer el resumen en voz alta.
 */
export function useReportesVozPage() {
  const navigate = useNavigate()
  const [resultado, setResultado] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [leerEnVoz, setLeerEnVoz] = useState(true)
  const lectura = useLectura()

  async function enviar(consulta) {
    const texto = consulta.trim()
    if (texto.length < 3) {
      setError('Diga o escriba qué reporte necesita.')
      return
    }

    setEnviando(true)
    setError('')
    lectura.callar()
    try {
      const respuesta = await consultarPorVoz(texto)
      setResultado(respuesta)
      if (leerEnVoz) lectura.leer(respuesta.entendido ? respuesta.resumen_hablado : respuesta.mensaje)
    } catch (err) {
      setError(Object.values(err.errors ?? {})[0]?.[0] ?? err.message)
    } finally {
      setEnviando(false)
    }
  }

  // Al terminar de hablar, la consulta se envía sola.
  const dictado = useDictado(enviar)

  function usarEjemplo(ejemplo) {
    dictado.setTexto(ejemplo)
    enviar(ejemplo)
  }

  /** El reporte interpretado, con sus filtros, en la versión imprimible de CU21. */
  function imprimir() {
    navigate(`${RUTAS.REPORTE_IMPRIMIR}?${new URLSearchParams(parametrosReporte(resultado.parametros))}`)
  }

  async function exportar() {
    const { tipo, ...filtros } = resultado.parametros
    try {
      descargarArchivo(await exportarReporte(tipo, filtros, 'detalle'), `reporte_${tipo}_detalle.csv`)
    } catch (err) {
      setError(err.status === 422 ? 'El detalle tiene demasiadas filas para exportarse. Acote el periodo.' : err.message)
    }
  }

  return {
    dictado,
    lectura,
    resultado,
    enviando,
    error: error || dictado.error,
    leerEnVoz,
    setLeerEnVoz,
    enviar: () => enviar(dictado.texto),
    usarEjemplo,
    imprimir,
    exportar,
  }
}
