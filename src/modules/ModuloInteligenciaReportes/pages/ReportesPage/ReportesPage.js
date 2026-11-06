import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { descargarArchivo } from '../../../../shared/utils/archivos'
import { RUTAS } from '../../../../shared/utils/constants'
import { exportarReporte, generarReporte, obtenerCatalogoReportes, parametrosReporte } from '../../services/reportes.service'
import { periodosRapidos } from '../../utils/reportes'

/** Cada filtro del catálogo: su etiqueta y de qué lista de opciones sale. */
export const CAMPOS_FILTRO = Object.freeze({
  medico: { etiqueta: 'Médico', opciones: 'medicos', todos: 'Todos los médicos' },
  especialidad: { etiqueta: 'Especialidad', opciones: 'especialidades', todos: 'Todas' },
  estado: { etiqueta: 'Estado de la cita', opciones: 'estados', todos: 'Todos' },
  modalidad: { etiqueta: 'Modalidad', opciones: 'modalidades', todos: 'Todas' },
  metodo: { etiqueta: 'Método de pago', opciones: 'metodos', todos: 'Todos' },
  estado_pago: { etiqueta: 'Estado del pago', opciones: 'estados_pago', todos: 'Todos', valorTodos: 'todos' },
})

const VALORES_INICIALES = { medico: '', especialidad: '', estado: '', modalidad: '', metodo: '', estado_pago: 'Completado' }

/**
 * Lógica de la página de reportes (CU21): elegir reporte, filtros y agrupación,
 * generarlo al instante y exportarlo a CSV o a la versión imprimible (PDF).
 */
export function useReportesPage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('')
  const [periodo, setPeriodo] = useState(() => periodosRapidos()[0])
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [agrupar, setAgrupar] = useState('')
  const [exportando, setExportando] = useState(null)
  const [errorExportacion, setErrorExportacion] = useState('')
  const [aviso, setAviso] = useAviso()

  const catalogo = useConsulta(obtenerCatalogoReportes)
  const reportes = catalogo.datos?.reportes ?? []
  // Sin elección, el primer reporte disponible para el usuario.
  const definicion = reportes.find((reporte) => reporte.tipo === tipo) ?? reportes[0] ?? null

  const errorRango = periodo.desde && periodo.hasta && periodo.hasta < periodo.desde ? 'La fecha final debe ser igual o posterior a la inicial.' : ''

  // Solo se envían los filtros que admite el reporte elegido.
  const filtros = definicion
    ? {
        desde: periodo.desde,
        hasta: periodo.hasta,
        agrupar: agrupar || definicion.agrupacion_por_defecto,
        ...Object.fromEntries(definicion.filtros.map((filtro) => [filtro, valores[filtro]])),
      }
    : null

  const reporte = useConsulta(
    () => (definicion && !errorRango && periodo.desde && periodo.hasta ? generarReporte(definicion.tipo, filtros) : Promise.resolve(null)),
    JSON.stringify([definicion?.tipo, filtros, errorRango]),
  )

  function elegirTipo(nuevo) {
    setTipo(nuevo)
    setAgrupar('')
    setErrorExportacion('')
  }

  function cambiarValor(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrorExportacion('')
  }

  function cambiarPeriodo(evento) {
    const { name, value } = evento.target
    setPeriodo((actual) => ({ ...actual, [name]: value }))
  }

  async function exportar(seccion) {
    setExportando(seccion)
    setErrorExportacion('')
    try {
      descargarArchivo(await exportarReporte(definicion.tipo, filtros, seccion), `reporte_${definicion.tipo}_${seccion}.csv`)
      setAviso('Reporte exportado.')
    } catch (err) {
      // La respuesta de error llega como Blob: se muestra un mensaje general.
      setErrorExportacion(err.status === 422 ? 'El detalle tiene demasiadas filas para exportarse. Acote el periodo o los filtros.' : err.message)
    } finally {
      setExportando(null)
    }
  }

  function imprimir() {
    const consulta = new URLSearchParams(parametrosReporte({ tipo: definicion.tipo, ...filtros }))
    navigate(`${RUTAS.REPORTE_IMPRIMIR}?${consulta}`)
  }

  return {
    catalogo: catalogo.datos,
    reportes,
    definicion,
    periodo,
    periodos: periodosRapidos(),
    valores,
    agrupar: filtros?.agrupar ?? '',
    errorRango,
    reporte: reporte.datos,
    cargando: reporte.cargando,
    error: catalogo.error || reporte.error,
    errorExportacion,
    exportando,
    aviso,
    elegirTipo,
    cambiarValor,
    cambiarPeriodo,
    aplicarPeriodo: (rapido) => setPeriodo({ desde: rapido.desde, hasta: rapido.hasta }),
    cambiarAgrupacion: (evento) => setAgrupar(evento.target.value),
    exportar,
    imprimir,
  }
}
