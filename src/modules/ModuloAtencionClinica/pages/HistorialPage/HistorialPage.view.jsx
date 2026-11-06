import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../../shared/utils/constants'
import { HistorialClinico } from '../../components/HistorialClinico'
import { useHistorialPage } from './HistorialPage'

/**
 * CU19 – Consultar Historial Clínico del Paciente.
 * @param {boolean} propio  "Mi historial" del paciente (true) o historial de un paciente del médico (false).
 */
export function HistorialPage({ propio = false }) {
  const pagina = useHistorialPage(propio)

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        {!propio && (
          <Link to={RUTAS.MEDICO_HISTORIAL} className="text-sm text-suave hover:text-texto hover:underline">
            ← Volver a mis pacientes
          </Link>
        )}
        <h1 className="text-3xl font-semibold">{propio ? 'Mi historial clínico' : 'Historial clínico'}</h1>
        <p className="text-suave">
          {propio
            ? 'Sus consultas, recetas y antecedentes registrados en la clínica.'
            : 'Consultas, recetas y antecedentes del paciente. Cada acceso queda registrado en la bitácora.'}
        </p>
      </header>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}
      {pagina.cargandoInicial && <Spinner pantallaCompleta mensaje="Cargando historial…" />}
      {pagina.historial && (
        <HistorialClinico historial={pagina.historial} cargandoConsultas={pagina.cargandoConsultas} onCambiarPagina={pagina.cambiarPagina} />
      )}
    </section>
  )
}
