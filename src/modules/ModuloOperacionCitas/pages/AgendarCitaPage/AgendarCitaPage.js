import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../core/api/error-handler'
import { useEspecialidades } from '../../../ModuloPersonalMedico/hooks/useEspecialidades'
import { useDisponibilidad } from '../../../ModuloPersonalMedico/hooks/useHorarios'
import { useAuth } from '../../../ModuloSeguridad/hooks/useAuth'
import { useDirectorioMedico, useModalidades } from '../../hooks/useCitas'
import { agendarCita } from '../../services/citas.service'
import { proximasFechasDeAtencion } from '../../utils/citas'

const LARGO_MINIMO_MOTIVO = 5

/**
 * Lógica del asistente para agendar una cita (CU13). Cada elección reinicia las
 * que dependen de ella: cambiar la especialidad borra el médico, el médico la
 * fecha y la fecha el turno.
 */
export function useAgendarCitaPage() {
  const { canAccess } = useAuth()
  // RN08: con 'citas_programar' se elige el paciente; el Paciente agenda para sí mismo.
  const esPersonal = canAccess('citas_programar')

  const [paciente, setPaciente] = useState(null)
  const [especialidad, setEspecialidad] = useState(null)
  const [medico, setMedico] = useState(null)
  const [fecha, setFecha] = useState('')
  const [turno, setTurno] = useState('')
  const [idModalidad, setIdModalidad] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [citaAgendada, setCitaAgendada] = useState(null)

  const { especialidades } = useEspecialidades({ activo: '1' })
  const { medicos, cargando: cargandoMedicos } = useDirectorioMedico(especialidad?.id)
  const { modalidades } = useModalidades()
  const { disponibilidad, cargando: cargandoTurnos, recargar: recargarTurnos } = useDisponibilidad(medico?.id, fecha)

  function limpiarErrores() {
    setErrores({})
    setErrorGeneral('')
  }

  function elegirEspecialidad(nueva) {
    setEspecialidad(nueva)
    setMedico(null)
    setFecha('')
    setTurno('')
    limpiarErrores()
  }

  function elegirMedico(nuevo) {
    setMedico(nuevo)
    // Se propone el próximo día en que atiende.
    setFecha(proximasFechasDeAtencion(nuevo.dias_atencion, 1)[0] ?? '')
    setTurno('')
    limpiarErrores()
  }

  function elegirFecha(nueva) {
    setFecha(nueva)
    setTurno('')
    limpiarErrores()
  }

  function cambiarMotivo(evento) {
    setMotivo(evento.target.value)
    setErrores((actuales) => ({ ...actuales, motivo: undefined }))
  }

  const completa = Boolean(
    (!esPersonal || paciente) && especialidad && medico && fecha && turno && idModalidad && motivo.trim(),
  )

  async function confirmar() {
    limpiarErrores()

    if (motivo.trim().length < LARGO_MINIMO_MOTIVO) {
      setErrores({ motivo: `El motivo debe tener al menos ${LARGO_MINIMO_MOTIVO} caracteres.` })
      return
    }

    setEnviando(true)
    try {
      const respuesta = await agendarCita({
        ...(esPersonal && { id_paciente: paciente.id }),
        id_especialidad: especialidad.id,
        id_medico: medico.id,
        id_modalidad: idModalidad,
        fecha,
        hra_inicio: turno,
        motivo: motivo.trim(),
      })
      setCitaAgendada(respuesta.data)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const porCampo = primerErrorPorCampo(error.errors)
        setErrores(porCampo)
        // Cualquier error que no sea del motivo se muestra en el resumen.
        const general = Object.entries(porCampo).find(([campo]) => campo !== 'motivo')
        if (general) setErrorGeneral(general[1])
        // E4: el turno ya no está disponible; se refrescan los turnos para elegir otro.
        if (porCampo.hra_inicio) {
          setTurno('')
          recargarTurnos()
        }
      } else {
        setErrorGeneral(error.message)
      }
    } finally {
      setEnviando(false)
    }
  }

  function agendarOtra() {
    setPaciente(null)
    setEspecialidad(null)
    setMedico(null)
    setFecha('')
    setTurno('')
    setIdModalidad(null)
    setMotivo('')
    limpiarErrores()
    setCitaAgendada(null)
  }

  return {
    esPersonal,
    paciente,
    especialidad,
    medico,
    fecha,
    turno,
    idModalidad,
    motivo,
    especialidades,
    medicos,
    cargandoMedicos,
    modalidades,
    turnos: disponibilidad?.turnos ?? [],
    cargandoTurnos,
    fechasSugeridas: medico ? proximasFechasDeAtencion(medico.dias_atencion) : [],
    errores,
    errorGeneral,
    enviando,
    completa,
    citaAgendada,
    elegirPaciente: (nuevo) => {
      setPaciente(nuevo)
      limpiarErrores()
    },
    elegirEspecialidad,
    elegirMedico,
    elegirFecha,
    elegirTurno: setTurno,
    elegirModalidad: setIdModalidad,
    cambiarMotivo,
    confirmar,
    agendarOtra,
  }
}
