import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../../shared/utils/constants'
import { CancelarCitaModal } from '../../components/CancelarCitaModal'
import { ReprogramarCitaModal } from '../../components/ReprogramarCitaModal'
import { TarjetaCita } from '../../components/TarjetaCita'
import { puedeModificar } from '../../utils/citas'
import { PERIODOS, useMisCitasPage } from './MisCitasPage'

/** Acciones de CU14 para una cita propia, según la anticipación permitida al paciente. */
function AccionesCita({ cita, onReprogramar, onCancelar }) {
  const { permitido, motivo } = puedeModificar(cita, false)

  if (motivo) return <p className="max-w-48 text-xs text-suave">{motivo}</p>
  if (!permitido) return null

  return (
    <>
      <Button variante="secundario" tamano="sm" onClick={() => onReprogramar(cita)}>
        Reprogramar
      </Button>
      <Button variante="secundario" tamano="sm" onClick={() => onCancelar(cita)}>
        Cancelar
      </Button>
    </>
  )
}

/**
 * CU13 – Mis citas (Paciente), con reprogramación y cancelación (CU14).
 */
export function MisCitasPage() {
  const navigate = useNavigate()
  const pagina = useMisCitasPage()
  const periodoActual = PERIODOS.find((p) => p.clave === pagina.periodo)

  return (
    <section className="flex max-w-4xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Mis citas</h1>
          <p className="text-suave">Sus citas agendadas y su historial de atenciones.</p>
        </div>
        <Button onClick={() => navigate(RUTAS.PACIENTE_CITA_NUEVA)}>Reservar cita</Button>
      </header>

      <div role="tablist" aria-label="Periodo" className="flex gap-1 border-b border-borde">
        {PERIODOS.map(({ clave, etiqueta }) => (
          <button
            key={clave}
            type="button"
            role="tab"
            aria-selected={pagina.periodo === clave}
            onClick={() => pagina.cambiarPeriodo(clave)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              pagina.periodo === clave ? 'border-primario text-texto' : 'border-transparent text-suave hover:text-texto'
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      {pagina.cargando && pagina.citas.length === 0 ? (
        <Spinner mensaje="Cargando citas…" />
      ) : pagina.citas.length === 0 ? (
        <p className="py-8 text-center text-suave">{periodoActual.vacio}</p>
      ) : (
        <ul className={`flex flex-col gap-3 ${pagina.cargando ? 'opacity-60' : ''}`}>
          {pagina.citas.map((cita) => (
            <li key={cita.id}>
              <TarjetaCita
                cita={cita}
                acciones={<AccionesCita cita={cita} onReprogramar={pagina.abrirReprogramacion} onCancelar={pagina.abrirCancelacion} />}
              />
            </li>
          ))}
        </ul>
      )}

      {pagina.modal?.tipo === 'reprogramar' && (
        <ReprogramarCitaModal cita={pagina.modal.cita} onCerrar={pagina.cerrarModal} onReprogramada={pagina.finalizarOperacion} />
      )}
      {pagina.modal?.tipo === 'cancelar' && (
        <CancelarCitaModal cita={pagina.modal.cita} onCerrar={pagina.cerrarModal} onCancelada={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
