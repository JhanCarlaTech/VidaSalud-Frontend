import { useState } from 'react'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { fechaISO } from '../../../../shared/utils/formatters'
import { obtenerDashboard } from '../../services/dashboard.service'
import { periodosRapidos } from '../../utils/reportes'

/** Atajos del periodo: primero los relativos (los que más se usan), luego mes y año. */
function atajos() {
  const [esteMes, , , esteAnio] = periodosRapidos()
  return [
    { etiqueta: 'Últimos 7 días', desde: fechaISO(-6), hasta: fechaISO() },
    { etiqueta: 'Últimos 30 días', desde: fechaISO(-29), hasta: fechaISO() },
    { etiqueta: 'Últimos 90 días', desde: fechaISO(-89), hasta: fechaISO() },
    esteMes,
    esteAnio,
  ]
}

/**
 * Lógica del tablero administrativo (CU23): un solo periodo que gobierna todos los
 * indicadores y gráficos, para que los números siempre coincidan.
 */
export function useDashboardPage() {
  const opciones = atajos()
  const [periodo, setPeriodo] = useState({ desde: opciones[1].desde, hasta: opciones[1].hasta })

  const errorRango = periodo.desde && periodo.hasta && periodo.hasta < periodo.desde ? 'La fecha final debe ser igual o posterior a la inicial.' : ''
  const { datos, cargando, error } = useConsulta(
    () => (errorRango || !periodo.desde || !periodo.hasta ? Promise.resolve(null) : obtenerDashboard(periodo)),
    JSON.stringify([periodo, errorRango]),
  )

  return {
    periodo,
    atajos: opciones,
    atajoActivo: opciones.find((atajo) => atajo.desde === periodo.desde && atajo.hasta === periodo.hasta)?.etiqueta ?? null,
    errorRango,
    tablero: datos,
    // Al cambiar el periodo se conserva el tablero anterior atenuado.
    cargandoInicial: cargando && !datos,
    actualizando: cargando && Boolean(datos),
    error,
    elegirAtajo: (atajo) => setPeriodo({ desde: atajo.desde, hasta: atajo.hasta }),
    cambiarFecha: (evento) => setPeriodo((actual) => ({ ...actual, [evento.target.name]: evento.target.value })),
  }
}
