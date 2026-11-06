import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Input } from '../../../../shared/components/ui/Input'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../../shared/utils/constants'
import { formatearDia, formatearFechaHora } from '../../../../shared/utils/formatters'
import { BarrasHorizontales } from '../../components/graficos/BarrasHorizontales'
import { GraficoLinea } from '../../components/graficos/GraficoLinea'
import { Indicador } from '../../components/graficos/Indicador'
import { PanelGrafico } from '../../components/graficos/PanelGrafico'
import { useDashboardPage } from './DashboardPage'

const CORTA = { dateStyle: 'medium' }

/**
 * CU23 – Visualizar Dashboard Administrativo.
 */
export function DashboardPage() {
  const pagina = useDashboardPage()
  const { tablero } = pagina

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-suave">
          Indicadores de la clínica en el periodo elegido. Para el detalle y la exportación, use{' '}
          <Link to={RUTAS.REPORTES} className="font-medium text-texto underline">
            Reportes
          </Link>
          .
        </p>
      </header>

      {/* Filtro único, arriba de todo lo que gobierna: primero el periodo. */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div role="group" aria-label="Periodo" className="flex flex-wrap gap-2">
          {pagina.atajos.map((atajo) => {
            const activo = pagina.atajoActivo === atajo.etiqueta
            return (
              <button
                key={atajo.etiqueta}
                type="button"
                aria-pressed={activo}
                onClick={() => pagina.elegirAtajo(atajo)}
                className={`min-h-9 cursor-pointer rounded-sm border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activo ? 'border-primario bg-primario text-white' : 'border-borde bg-white hover:border-primario'
                }`}
              >
                {atajo.etiqueta}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:ml-auto lg:w-80">
          <Input etiqueta="Desde" name="desde" type="date" value={pagina.periodo.desde} onChange={pagina.cambiarFecha} />
          <Input etiqueta="Hasta" name="hasta" type="date" value={pagina.periodo.hasta} min={pagina.periodo.desde || undefined} onChange={pagina.cambiarFecha} error={pagina.errorRango} />
        </div>
      </div>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}
      {pagina.cargandoInicial && <Spinner mensaje="Cargando indicadores…" />}

      {tablero && (
        <div className={`flex flex-col gap-6 transition-opacity ${pagina.actualizando ? 'opacity-60' : ''}`} aria-busy={pagina.actualizando || undefined}>
          <p className="text-sm text-suave">
            Del {formatearDia(tablero.periodo.desde, CORTA)} al {formatearDia(tablero.periodo.hasta, CORTA)} ({tablero.periodo.dias} días), comparado con el{' '}
            {formatearDia(tablero.anterior.desde, CORTA)} al {formatearDia(tablero.anterior.hasta, CORTA)}.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {tablero.indicadores.map((indicador) => (
              <Indicador key={indicador.clave} indicador={indicador} />
            ))}
          </div>

          <PanelGrafico
            titulo="Atenciones por día"
            descripcion="Consultas médicas registradas (CU17)."
            columnas={[
              { clave: 'fecha', etiqueta: 'Fecha', formato: 'fecha' },
              { clave: 'valor', etiqueta: 'Atenciones', formato: 'numero' },
            ]}
            filas={tablero.atenciones_por_dia}
          >
            <GraficoLinea serie={tablero.atenciones_por_dia} etiqueta="Atenciones" />
          </PanelGrafico>

          <div className="grid gap-6 lg:grid-cols-2">
            <PanelGrafico
              titulo="Ocupación de agenda por médico"
              descripcion="Citas no canceladas sobre los turnos de su horario, sin contar licencias."
              columnas={[
                { clave: 'grupo', etiqueta: 'Médico', formato: 'texto' },
                { clave: 'ocupados', etiqueta: 'Turnos ocupados', formato: 'numero' },
                { clave: 'capacidad', etiqueta: 'Turnos ofrecidos', formato: 'numero' },
                { clave: 'valor', etiqueta: 'Ocupación', formato: 'porcentaje' },
              ]}
              filas={tablero.ocupacion}
            >
              <BarrasHorizontales
                filas={tablero.ocupacion.map((fila) => ({ ...fila, detalle: `${fila.ocupados} de ${fila.capacidad} turnos` }))}
                formato="porcentaje"
                maximo={100}
                sinValor="Sin horario"
              />
            </PanelGrafico>

            <PanelGrafico
              titulo="Ingresos por método de pago"
              descripcion="Pagos completados (CU24)."
              columnas={[
                { clave: 'grupo', etiqueta: 'Método', formato: 'texto' },
                { clave: 'pagos', etiqueta: 'Pagos', formato: 'numero' },
                { clave: 'valor', etiqueta: 'Monto', formato: 'moneda' },
              ]}
              filas={tablero.ingresos_por_metodo}
            >
              <BarrasHorizontales
                filas={tablero.ingresos_por_metodo.map((fila) => ({ ...fila, detalle: `${fila.pagos} ${fila.pagos === 1 ? 'pago' : 'pagos'}` }))}
                formato="moneda"
              />
            </PanelGrafico>
          </div>

          <PanelGrafico
            titulo="Citas por estado"
            descripcion="Citas con fecha en el periodo."
            columnas={[
              { clave: 'grupo', etiqueta: 'Estado', formato: 'texto' },
              { clave: 'valor', etiqueta: 'Citas', formato: 'numero' },
            ]}
            filas={tablero.citas_por_estado}
          >
            <BarrasHorizontales filas={tablero.citas_por_estado} />
          </PanelGrafico>

          <p className="text-xs text-suave">Actualizado el {formatearFechaHora(tablero.generado_en)}.</p>
        </div>
      )}
    </section>
  )
}
