import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { descargarArchivo } from '../../../../shared/utils/archivos'
import { fechaISO } from '../../../../shared/utils/formatters'
import { exportarBitacora, listarBitacora, obtenerCatalogoBitacora } from '../../services/bitacora.service'

const FILTROS_INICIALES = { buscar: '', accion: '', tabla: '', ip: '', desde: '', hasta: '' }

/** Atajos de rango de fechas: días hacia atrás, contando hoy. */
export const RANGOS_RAPIDOS = Object.freeze([
  { etiqueta: 'Hoy', dias: 1 },
  { etiqueta: 'Últimos 7 días', dias: 7 },
  { etiqueta: 'Últimos 30 días', dias: 30 },
])

/**
 * Lógica de la bitácora de auditoría (CU06): filtros, paginación, detalle
 * del evento y exportación a CSV con los mismos filtros.
 */
export function useBitacoraPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)
  const [idDetalle, setIdDetalle] = useState(null)
  const [exportando, setExportando] = useState(false)
  const [errorExportacion, setErrorExportacion] = useState('')
  const [aviso, setAviso] = useAviso()

  // Los campos de texto esperan a que se deje de escribir.
  const buscar = useDebounce(filtros.buscar.trim())
  const ip = useDebounce(filtros.ip.trim())

  // E1: el rango se valida aquí para no consultar con fechas invertidas (el servidor también lo valida).
  const errorRango = filtros.desde && filtros.hasta && filtros.hasta < filtros.desde ? 'La fecha final debe ser igual o posterior a la inicial.' : ''

  const consulta = { buscar, ip, accion: filtros.accion, tabla: filtros.tabla, desde: filtros.desde, hasta: filtros.hasta }

  const catalogo = useConsulta(obtenerCatalogoBitacora)
  const listado = useConsulta(
    () => (errorRango ? Promise.resolve(null) : listarBitacora({ ...consulta, page: pagina })),
    JSON.stringify([consulta, pagina, errorRango]),
  )

  const meta = listado.datos?.meta ?? null
  const maximoExportacion = catalogo.datos?.maximo_exportacion ?? 0

  function cambiarFiltro(evento) {
    const { name, value } = evento.target
    setFiltros((actuales) => ({ ...actuales, [name]: value }))
    setPagina(1)
    setErrorExportacion('')
  }

  function aplicarRango(dias) {
    setFiltros((actuales) => ({ ...actuales, desde: fechaISO(-(dias - 1)), hasta: fechaISO() }))
    setPagina(1)
    setErrorExportacion('')
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES)
    setPagina(1)
    setErrorExportacion('')
  }

  /** RN06: se avisa antes de pedir un archivo que el servidor rechazaría. */
  async function exportar() {
    setErrorExportacion('')
    if (!meta || meta.total === 0) {
      setErrorExportacion('No hay eventos que coincidan con los filtros.')
      return
    }
    if (meta.total > maximoExportacion) {
      setErrorExportacion(
        `Hay ${meta.total.toLocaleString('es-BO')} eventos con estos filtros y se pueden exportar hasta ${maximoExportacion.toLocaleString('es-BO')}. Acote el rango de fechas o los filtros.`,
      )
      return
    }

    setExportando(true)
    try {
      descargarArchivo(await exportarBitacora(consulta), `bitacora_${fechaISO()}.csv`)
      setAviso(`Se exportaron ${meta.total.toLocaleString('es-BO')} eventos.`)
      // La exportación queda registrada como un evento nuevo (RN07).
      listado.recargar()
    } catch (err) {
      setErrorExportacion(err.message)
    } finally {
      setExportando(false)
    }
  }

  return {
    filtros,
    hayFiltros: Object.values(filtros).some(Boolean),
    errorRango,
    acciones: catalogo.datos?.acciones ?? [],
    tablas: catalogo.datos?.tablas ?? [],
    eventos: listado.datos?.items ?? [],
    meta,
    cargando: listado.cargando,
    error: listado.error || catalogo.error,
    aviso,
    errorExportacion,
    exportando,
    idDetalle,
    cambiarFiltro,
    aplicarRango,
    limpiarFiltros,
    cambiarPagina: setPagina,
    exportar,
    verDetalle: setIdDetalle,
    cerrarDetalle: () => setIdDetalle(null),
  }
}
