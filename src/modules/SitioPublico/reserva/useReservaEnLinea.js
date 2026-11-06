import { useState } from 'react'
import { primerErrorPorCampo } from '../../../core/api/error-handler'
import { useConsulta } from '../../../shared/hooks/useConsulta'
import { ROLES } from '../../../shared/utils/constants'
import { agendarCita } from '../../ModuloOperacionCitas/services/citas.service'
import {
  listarMedicosPublicos,
  listarModalidadesPublicas,
  obtenerDisponibilidadPublica,
} from '../../ModuloOperacionCitas/services/reservaPublica.service'
import { proximasFechasDeAtencion } from '../../ModuloOperacionCitas/utils/citas'
import { useAuth } from '../../ModuloSeguridad/hooks/useAuth'

const LARGO_MINIMO_MOTIVO = 5

/**
 * Etapas de la reserva en línea:
 * - 'eleccion': especialidad → médico → fecha y turno → modalidad y motivo.
 * - 'cuenta':   el visitante sin sesión crea su cuenta de paciente o inicia sesión.
 * - 'pago':     la cita ya está agendada; se paga el precio de la especialidad (CU24).
 * - 'listo':    comprobante de la cita y del pago.
 */
export const ETAPAS = Object.freeze({ ELECCION: 'eleccion', CUENTA: 'cuenta', PAGO: 'pago', LISTO: 'listo' })

/** ¿La sesión puede reservar para sí misma? Solo los pacientes (CU13, RN08). */
export function esSesionDePaciente(sesion) {
  return Boolean(sesion?.roles.includes(ROLES.PACIENTE))
}

/**
 * Lógica del asistente de reserva de la página principal (CU13 + CU24).
 * Los catálogos se consultan sin sesión; agendar y pagar exigen una cuenta de
 * paciente, que se crea o abre en la etapa 'cuenta' sin perder lo elegido.
 */
export function useReservaEnLinea() {
  const { sesion } = useAuth()

  const [abierta, setAbierta] = useState(false)
  const [etapa, setEtapa] = useState(ETAPAS.ELECCION)
  const [especialidad, setEspecialidad] = useState(null)
  const [medico, setMedico] = useState(null)
  const [fecha, setFecha] = useState('')
  const [turno, setTurno] = useState('')
  const [idModalidad, setIdModalidad] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [agendando, setAgendando] = useState(false)
  const [cita, setCita] = useState(null)
  const [pago, setPago] = useState(null)

  const consultaMedicos = useConsulta(
    () => (especialidad ? listarMedicosPublicos(especialidad.id) : Promise.resolve([])),
    String(especialidad?.id ?? ''),
  )
  const consultaTurnos = useConsulta(
    () => (medico && fecha ? obtenerDisponibilidadPublica(medico.id, fecha) : Promise.resolve(null)),
    `${medico?.id}|${fecha}`,
  )
  const { datos: modalidades } = useConsulta(listarModalidadesPublicas)

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

  const completa = Boolean(especialidad && medico && fecha && turno && idModalidad && motivo.trim())

  /** Agenda la cita a nombre del paciente con sesión y pasa al pago. */
  async function agendar(sesionActual) {
    if (!esSesionDePaciente(sesionActual)) {
      setEtapa(ETAPAS.ELECCION)
      setErrorGeneral('Su cuenta no es de paciente. Para agendar a nombre de un paciente, use su panel.')
      return
    }

    setAgendando(true)
    try {
      const respuesta = await agendarCita({
        id_especialidad: especialidad.id,
        id_medico: medico.id,
        id_modalidad: idModalidad,
        fecha,
        hra_inicio: turno,
        motivo: motivo.trim(),
      })
      setCita(respuesta.data)
      setEtapa(ETAPAS.PAGO)
    } catch (error) {
      setEtapa(ETAPAS.ELECCION)
      if (error.status === 422 && error.errors) {
        const porCampo = primerErrorPorCampo(error.errors)
        setErrores(porCampo)
        const general = Object.entries(porCampo).find(([campo]) => campo !== 'motivo')
        if (general) setErrorGeneral(general[1])
        // E4: el turno ya no está disponible; se refrescan los turnos para elegir otro.
        if (porCampo.hra_inicio) {
          setTurno('')
          consultaTurnos.recargar()
        }
      } else {
        setErrorGeneral(error.message)
      }
    } finally {
      setAgendando(false)
    }
  }

  /** "Confirmar cita": sin sesión, primero se pide la cuenta. */
  function confirmar() {
    limpiarErrores()

    if (motivo.trim().length < LARGO_MINIMO_MOTIVO) {
      setErrores({ motivo: `El motivo debe tener al menos ${LARGO_MINIMO_MOTIVO} caracteres.` })
      return
    }

    if (!sesion) {
      setEtapa(ETAPAS.CUENTA)
      return
    }

    agendar(sesion)
  }

  function finalizarPago(pagoRegistrado) {
    setPago(pagoRegistrado)
    setEtapa(ETAPAS.LISTO)
  }

  function reiniciar() {
    setEtapa(ETAPAS.ELECCION)
    setEspecialidad(null)
    setMedico(null)
    setFecha('')
    setTurno('')
    setIdModalidad(null)
    setMotivo('')
    limpiarErrores()
    setCita(null)
    setPago(null)
  }

  /**
   * Abre la ventana del asistente; con una especialidad (desde su tarjeta) la deja
   * elegida si todavía se está eligiendo la cita.
   */
  function abrir(especialidadElegida) {
    if (especialidadElegida && etapa === ETAPAS.ELECCION) elegirEspecialidad(especialidadElegida)
    setAbierta(true)
  }

  /** Cerrar conserva lo elegido, salvo que la reserva ya terminó. */
  function cerrar() {
    setAbierta(false)
    if (etapa === ETAPAS.LISTO) reiniciar()
  }

  return {
    abierta,
    abrir,
    cerrar,
    etapa,
    sesion,
    especialidad,
    medico,
    fecha,
    turno,
    idModalidad,
    motivo,
    medicos: consultaMedicos.datos ?? [],
    cargandoMedicos: consultaMedicos.cargando,
    modalidades: modalidades ?? [],
    turnos: consultaTurnos.datos?.turnos ?? [],
    cargandoTurnos: consultaTurnos.cargando,
    fechasSugeridas: medico ? proximasFechasDeAtencion(medico.dias_atencion) : [],
    errores,
    errorGeneral,
    agendando,
    completa,
    cita,
    pago,
    elegirEspecialidad,
    elegirMedico,
    elegirFecha,
    elegirTurno: setTurno,
    elegirModalidad: setIdModalidad,
    cambiarMotivo,
    confirmar,
    agendar,
    volverAEleccion: () => setEtapa(ETAPAS.ELECCION),
    finalizarPago,
    reiniciar,
  }
}
