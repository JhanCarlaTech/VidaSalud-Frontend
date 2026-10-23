import { useState } from 'react'
import { primerErrorPorCampo } from '../../../core/api/error-handler'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Modal } from '../../../shared/components/ui/Modal'
import { Select } from '../../../shared/components/ui/Select'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { DIAS_MAXIMOS_DISPONIBILIDAD } from '../../../shared/utils/constants'
import { fechaISO } from '../../../shared/utils/formatters'
import { useDisponibilidad } from '../../ModuloPersonalMedico/hooks/useHorarios'
import { useModalidades } from '../hooks/useCitas'
import { reprogramarCita } from '../services/citas.service'
import { fechaCorta, fechaLarga, proximasFechasDeAtencion } from '../utils/citas'
import { SlotPicker } from './SlotPicker'

/**
 * Reprogramación de una cita a otro turno del mismo médico (CU14, flujo 2).
 */
export function ReprogramarCitaModal({ cita, onCerrar, onReprogramada }) {
  const fechasSugeridas = proximasFechasDeAtencion(cita.medico.dias_atencion)
  const [fecha, setFecha] = useState(fechasSugeridas[0] ?? '')
  const [turno, setTurno] = useState('')
  const [idModalidad, setIdModalidad] = useState(cita.modalidad.id)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { modalidades } = useModalidades()
  const { disponibilidad, cargando, recargar } = useDisponibilidad(cita.medico.id, fecha)
  const turnos = disponibilidad?.turnos ?? []

  function elegirFecha(nueva) {
    setFecha(nueva)
    setTurno('')
    setError('')
  }

  async function confirmar() {
    setError('')
    setEnviando(true)
    try {
      const respuesta = await reprogramarCita(cita.id, { fecha, hra_inicio: turno, id_modalidad: Number(idModalidad) })
      onReprogramada(respuesta.message)
    } catch (err) {
      const porCampo = err.errors ? primerErrorPorCampo(err.errors) : {}
      setError(Object.values(porCampo)[0] ?? err.message)
      // El turno pudo ocuparse mientras tanto: se actualizan los turnos para elegir otro.
      if (porCampo.hra_inicio) {
        setTurno('')
        recargar()
      }
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      titulo={`Reprogramar cita ${cita.codigo}`}
      descripcion={`${cita.medico.nombre_completo} · actualmente el ${fechaLarga(cita.fecha)} a las ${cita.hora_inicio}`}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button onClick={confirmar} disabled={!turno} cargando={enviando}>
            Reprogramar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {error && <Alert variante="error">{error}</Alert>}

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">Nueva fecha</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Próximas fechas de atención">
            {fechasSugeridas.map((sugerida) => (
              <button
                key={sugerida}
                type="button"
                onClick={() => elegirFecha(sugerida)}
                aria-pressed={fecha === sugerida}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
                  fecha === sugerida ? 'border-primario bg-primario text-white' : 'border-borde bg-white hover:border-primario'
                }`}
              >
                {fechaCorta(sugerida)}
              </button>
            ))}
          </div>
          <div className="sm:w-48">
            <Input
              etiqueta="Otra fecha"
              type="date"
              value={fecha}
              min={fechaISO()}
              max={fechaISO(DIAS_MAXIMOS_DISPONIBILIDAD)}
              onChange={(evento) => evento.target.value && elegirFecha(evento.target.value)}
            />
          </div>
        </div>

        {fecha &&
          (cargando && turnos.length === 0 ? (
            <Spinner mensaje="Consultando turnos…" />
          ) : turnos.length === 0 ? (
            <p className="text-sm text-suave">El médico no atiende ese día.</p>
          ) : (
            <SlotPicker turnos={turnos} seleccionado={turno} onSeleccionar={setTurno} deshabilitado={cargando || enviando} />
          ))}

        <div className="sm:w-1/2">
          <Select
            etiqueta="Modalidad"
            value={idModalidad}
            onChange={(evento) => setIdModalidad(evento.target.value)}
            opciones={modalidades.map((modalidad) => ({ valor: modalidad.id, etiqueta: modalidad.nombre }))}
          />
        </div>
      </div>
    </Modal>
  )
}
