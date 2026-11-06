import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Input } from '../../../../shared/components/ui/Input'
import { Select } from '../../../../shared/components/ui/Select'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { ReporteDocumento } from '../../components/ReporteDocumento'
import { CAMPOS_FILTRO, useReportesPage } from './ReportesPage'

/**
 * CU21 – Generar Reportes Operativos Tradicionales.
 */
export function ReportesPage() {
  const pagina = useReportesPage()
  const { definicion, catalogo } = pagina

  if (!catalogo) {
    return pagina.error ? <Alert variante="error">{pagina.error}</Alert> : <Spinner pantallaCompleta mensaje="Cargando reportes…" />
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Reportes</h1>
        <p className="text-suave">
          {catalogo.alcance === 'personal'
            ? 'Reportes de sus propias citas y atenciones.'
            : 'Citas, atenciones, inasistencias e ingresos de la clínica. Exporte a CSV o imprímalos como PDF.'}
        </p>
      </header>

      {/* Tipo de reporte */}
      <div role="radiogroup" aria-label="Tipo de reporte" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pagina.reportes.map((reporte) => {
          const elegido = reporte.tipo === definicion?.tipo
          return (
            <button
              key={reporte.tipo}
              type="button"
              role="radio"
              aria-checked={elegido}
              onClick={() => pagina.elegirTipo(reporte.tipo)}
              className={`flex cursor-pointer flex-col gap-1 rounded-md border p-4 text-left transition-colors ${
                elegido ? 'border-primario bg-primario text-white' : 'border-borde bg-white hover:border-primario'
              }`}
            >
              <span className="font-semibold">{reporte.titulo}</span>
              <span className={`text-xs ${elegido ? 'text-white/80' : 'text-suave'}`}>{reporte.descripcion}</span>
            </button>
          )
        })}
      </div>

      {/* Filtros */}
      {definicion && (
        <div className="flex flex-col gap-4 rounded-md border border-borde bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input etiqueta="Desde" name="desde" type="date" value={pagina.periodo.desde} max={pagina.periodo.hasta || undefined} onChange={pagina.cambiarPeriodo} />
            <Input
              etiqueta="Hasta"
              name="hasta"
              type="date"
              value={pagina.periodo.hasta}
              min={pagina.periodo.desde || undefined}
              onChange={pagina.cambiarPeriodo}
              error={pagina.errorRango}
            />
            {definicion.filtros.map((filtro) => {
              const campo = CAMPOS_FILTRO[filtro]
              return (
                <Select
                  key={filtro}
                  etiqueta={campo.etiqueta}
                  name={filtro}
                  value={pagina.valores[filtro]}
                  onChange={pagina.cambiarValor}
                  opciones={[
                    { valor: campo.valorTodos ?? '', etiqueta: campo.todos },
                    ...(catalogo.opciones[campo.opciones] ?? []).map((opcion) => ({ valor: String(opcion.valor), etiqueta: opcion.etiqueta })),
                  ]}
                />
              )
            })}
            <Select etiqueta="Agrupar por" name="agrupar" value={pagina.agrupar} onChange={pagina.cambiarAgrupacion} opciones={definicion.agrupaciones} />
          </div>
          <div className="flex flex-wrap gap-2">
            {pagina.periodos.map((rapido) => (
              <Button key={rapido.etiqueta} variante="secundario" tamano="sm" onClick={() => pagina.aplicarPeriodo(rapido)}>
                {rapido.etiqueta}
              </Button>
            ))}
          </div>
        </div>
      )}

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}
      {pagina.errorExportacion && <Alert variante="error">{pagina.errorExportacion}</Alert>}

      {pagina.reporte && (
        <>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variante="secundario" onClick={() => pagina.exportar('agrupado')} cargando={pagina.exportando === 'agrupado'} disabled={pagina.cargando}>
              Exportar resumen (CSV)
            </Button>
            <Button variante="secundario" onClick={() => pagina.exportar('detalle')} cargando={pagina.exportando === 'detalle'} disabled={pagina.cargando}>
              Exportar detalle (CSV)
            </Button>
            <Button onClick={pagina.imprimir} disabled={pagina.cargando}>
              Imprimir / PDF
            </Button>
          </div>
          <ReporteDocumento reporte={pagina.reporte} cargando={pagina.cargando} />
        </>
      )}
      {!pagina.reporte && pagina.cargando && <Spinner mensaje="Generando reporte…" />}
    </section>
  )
}
