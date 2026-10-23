import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { fechaLarga } from '../../../utils/citas'

function Fila({ etiqueta, valor }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className={`text-sm ${valor ? 'font-medium' : 'text-sutil'}`}>{valor || 'Sin elegir'}</dd>
    </div>
  )
}

/**
 * Resumen de la cita en construcción con el botón de confirmación (CU13, paso 6).
 */
export function ResumenCita({ asistente }) {
  const turnoElegido = asistente.turnos.find((turno) => turno.hora_inicio === asistente.turno)
  const modalidad = asistente.modalidades.find((m) => m.id === asistente.idModalidad)

  return (
    <aside className="flex flex-col gap-5 rounded-md border border-borde bg-white p-5 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold">Resumen</h2>

      <dl className="flex flex-col gap-3">
        {asistente.esPersonal && <Fila etiqueta="Paciente" valor={asistente.paciente?.usuario.nombre_completo} />}
        <Fila etiqueta="Especialidad" valor={asistente.especialidad?.nombre} />
        <Fila etiqueta="Médico" valor={asistente.medico?.nombre_completo} />
        <Fila etiqueta="Fecha" valor={asistente.fecha && <span className="capitalize">{fechaLarga(asistente.fecha)}</span>} />
        <Fila etiqueta="Hora" valor={turnoElegido && `${turnoElegido.hora_inicio} – ${turnoElegido.hora_fin}`} />
        <Fila etiqueta="Modalidad" valor={modalidad?.nombre} />
      </dl>

      {asistente.errorGeneral && <Alert variante="error">{asistente.errorGeneral}</Alert>}

      <Button bloque onClick={asistente.confirmar} disabled={!asistente.completa} cargando={asistente.enviando}>
        {asistente.esPersonal ? 'Agendar cita' : 'Confirmar reserva'}
      </Button>
      {!asistente.completa && <p className="text-center text-xs text-suave">Complete todos los pasos para confirmar.</p>}
    </aside>
  )
}
