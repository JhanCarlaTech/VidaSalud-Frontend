import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { ReporteDocumento } from '../../components/ReporteDocumento'
import { generarReporte } from '../../services/reportes.service'

/**
 * Versión imprimible de un reporte (CU21), fuera del diseño principal; los filtros
 * llegan en la URL. "Guardar como PDF" lo ofrece el diálogo de impresión del navegador.
 */
export function ReporteImprimiblePage() {
  const navigate = useNavigate()
  const [parametros] = useSearchParams()
  const { tipo, ...filtros } = Object.fromEntries(parametros)

  const { datos: reporte, error, cargando } = useConsulta(() => generarReporte(tipo, filtros), parametros.toString())

  return (
    <main className="papel min-h-screen bg-superficie-subtil px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variante="secundario" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        {reporte && <Button onClick={() => window.print()}>Imprimir / Guardar como PDF</Button>}
      </div>

      <div className="mx-auto max-w-5xl rounded-xl bg-superficie p-8 shadow-suave print:max-w-none print:p-0 print:shadow-none">
        {cargando && <Spinner mensaje="Generando reporte…" />}
        {!cargando && error && <Alert variante="error">{error}</Alert>}
        {!cargando && reporte && <ReporteDocumento reporte={reporte} clinica="Clínica Vida Salud" />}
      </div>
    </main>
  )
}
