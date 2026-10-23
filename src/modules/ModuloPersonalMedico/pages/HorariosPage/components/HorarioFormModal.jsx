import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Select } from '../../../../../shared/components/ui/Select'
import { DIAS_SEMANA, DURACIONES_TURNO } from '../../../../../shared/utils/constants'
import { minutosDelDia } from '../../../../../shared/utils/formatters'
import { actualizarHorario, crearHorario } from '../../../services/horarios.service'

const ID_FORMULARIO = 'formulario-horario'
const CAMPOS = ['dia_semana', 'hora_inicio', 'hora_fin', 'duracion_minutos']
const OPCIONES_DURACION = DURACIONES_TURNO.map((minutos) => ({ valor: minutos, etiqueta: `${minutos} minutos` }))

/** Minutos del bloque, o null si las horas aún no son válidas. */
function minutosDelBloque({ hora_inicio, hora_fin }) {
  if (!hora_inicio || !hora_fin) return null
  return minutosDelDia(hora_fin) - minutosDelDia(hora_inicio)
}

/** Validación en el cliente (RN01 / E1). El servidor vuelve a validar siempre. */
function validar(valores) {
  const errores = {}
  const minutos = minutosDelBloque(valores)

  if (!valores.hora_inicio) errores.hora_inicio = 'Ingrese la hora de inicio.'
  if (!valores.hora_fin) errores.hora_fin = 'Ingrese la hora de fin.'
  else if (minutos !== null && minutos <= 0) errores.hora_fin = 'La hora de fin debe ser posterior a la de inicio.'
  else if (minutos !== null && minutos < valores.duracion_minutos) {
    errores.hora_fin = `El bloque debe durar al menos un turno de ${valores.duracion_minutos} minutos.`
  }

  return errores
}

/**
 * Alta y modificación de un bloque de la grilla semanal (CU09). Muestra una
 * vista previa de cuántos turnos genera el bloque.
 * @param {object | null} horario  null para agregar uno nuevo.
 */
export function HorarioFormModal({ idMedico, horario, diaInicial, onCerrar, onGuardado }) {
  const esNuevo = horario === null
  const [valores, setValores] = useState({
    dia_semana: horario?.dia_semana ?? diaInicial ?? 1,
    hora_inicio: horario?.hora_inicio ?? '08:00',
    hora_fin: horario?.hora_fin ?? '12:00',
    duracion_minutos: horario?.duracion_minutos ?? 30,
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const minutos = minutosDelBloque(valores)
  const turnos = minutos > 0 ? Math.floor(minutos / valores.duracion_minutos) : 0
  const sobrante = minutos > 0 ? minutos % valores.duracion_minutos : 0

  function manejarCambio(evento) {
    const { name, value } = evento.target
    const numerico = name === 'dia_semana' || name === 'duracion_minutos'
    setValores((actuales) => ({ ...actuales, [name]: numerico ? Number(value) : value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const respuesta = esNuevo ? await crearHorario(idMedico, valores) : await actualizarHorario(idMedico, horario.id, valores)
      onGuardado(respuesta.message)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const porCampo = primerErrorPorCampo(error.errors)
        setErrores(porCampo)
        // Errores que no son de un campo (p. ej. citas pendientes, RN03) se muestran arriba.
        const general = Object.entries(porCampo).find(([campo]) => !CAMPOS.includes(campo))
        if (general) setErrorGeneral(general[1])
      } else {
        setErrorGeneral(error.message)
      }
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      titulo={esNuevo ? 'Agregar bloque de atención' : 'Editar bloque de atención'}
      descripcion="Defina el día, el rango de horas y la duración de cada turno."
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNuevo ? 'Agregar bloque' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={enviando}>
          <legend className="sr-only">Bloque de atención</legend>
          <Select
            etiqueta="Día"
            name="dia_semana"
            value={valores.dia_semana}
            onChange={manejarCambio}
            opciones={DIAS_SEMANA}
            error={errores.dia_semana}
          />
          <Select
            etiqueta="Duración del turno"
            name="duracion_minutos"
            value={valores.duracion_minutos}
            onChange={manejarCambio}
            opciones={OPCIONES_DURACION}
            error={errores.duracion_minutos}
          />
          <Input etiqueta="Hora de inicio" name="hora_inicio" type="time" value={valores.hora_inicio} onChange={manejarCambio} error={errores.hora_inicio} />
          <Input etiqueta="Hora de fin" name="hora_fin" type="time" value={valores.hora_fin} onChange={manejarCambio} error={errores.hora_fin} />
        </fieldset>

        {turnos > 0 && (
          <p className="rounded-sm border border-borde bg-superficie px-4 py-3 text-sm">
            Se ofrecerán <strong className="font-semibold">{turnos} {turnos === 1 ? 'turno' : 'turnos'}</strong> de{' '}
            {valores.duracion_minutos} minutos.
            {sobrante > 0 && <span className="text-suave"> Los últimos {sobrante} minutos no completan un turno y no se ofrecerán.</span>}
          </p>
        )}
      </form>
    </Modal>
  )
}
