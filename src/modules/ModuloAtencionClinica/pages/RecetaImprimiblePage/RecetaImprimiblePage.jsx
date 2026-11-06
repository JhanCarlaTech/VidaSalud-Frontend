import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { RecetaDocumento } from '../../components/RecetaDocumento'
import { obtenerReceta } from '../../services/recetas.service'

/**
 * Versión imprimible de la receta (CU18). Está fuera del diseño principal para que
 * solo se imprima el documento; "Guardar como PDF" lo ofrece el diálogo del navegador.
 * La ven el médico que la emitió y el propio paciente (RN05, lo verifica el servidor).
 */
export function RecetaImprimiblePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { datos: receta, error, cargando } = useConsulta(() => obtenerReceta(id), id)

  return (
    <main className="min-h-screen bg-superficie px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variante="secundario" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        {receta && <Button onClick={() => window.print()}>Imprimir / Guardar como PDF</Button>}
      </div>

      {cargando && <Spinner pantallaCompleta mensaje="Cargando receta…" />}
      {!cargando && error && (
        <div className="mx-auto max-w-3xl">
          <Alert variante="error">{error}</Alert>
        </div>
      )}
      {!cargando && receta && (
        <div className="shadow-suave print:shadow-none">
          <RecetaDocumento receta={receta} />
        </div>
      )}
    </main>
  )
}
