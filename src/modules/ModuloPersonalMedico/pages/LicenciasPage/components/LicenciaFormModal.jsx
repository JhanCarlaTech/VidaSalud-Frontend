import { useEffect, useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Select } from '../../../../../shared/components/ui/Select'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { Toggle } from '../../../../../shared/components/ui/Toggle'
import { useDebounce } from '../../../../../shared/hooks/useDebounce'
import { fechaISO } from '../../../../../shared/utils/formatters'
import { actualizarLicencia, crearLicencia, obtenerCitasAfectadas } from '../../../services/licencias.service'
import { FIN_DEL_DIA, INICIO_DEL_DIA, separarFechaHora } from '../../../utils/licencias'
import { CitasAfectadas } from './CitasAfectadas'

const ID_FORMULARIO = 'formulario-licencia'
const CAMPOS = ['id_medico', 'fecha_inicio', 'fecha_fin', 'motivo']
const MOTIVOS_FRECUENTES = ['Vacaciones', 'Baja por enfermedad', 'Capacitación', 'Congreso médico', 'Trámite personal']

function valoresIniciales(licencia, idMedicoInicial) {
  if (!licencia) {
    const hoy = fechaISO()
    return { id_medico: idMedicoInicial ?? '', diasCompletos: true, desde: hoy, horaDesde: '08:00', hasta: hoy, horaHasta: '12:00', motivo: '' }
  }

  const inicio = separarFechaHora(licencia.fecha_inicio)
  const fin = separarFechaHora(licencia.fecha_fin)
  return {
    id_medico: licencia.medico.id,
    diasCompletos: licencia.dias_completos,
    desde: inicio.fecha,
    horaDesde: licencia.dias_completos ? '08:00' : inicio.hora,
    hasta: fin.fecha,
    horaHasta: licencia.dias_completos ? '12:00' : fin.hora,
    motivo: licencia.motivo ?? '',
  }
}

/** Periodo en el formato de la API, o null si falta algún dato. */
function periodo(valores) {
  if (!valores.desde || !valores.hasta) return null
  if (!valores.diasCompletos && (!valores.horaDesde || !valores.horaHasta)) return null

  return {
    fecha_inicio: `${valores.desde} ${valores.diasCompletos ? INICIO_DEL_DIA : valores.horaDesde}`,
    fecha_fin: `${valores.hasta} ${valores.diasCompletos ? FIN_DEL_DIA : valores.horaHasta}`,
  }
}

/** Validación en el cliente (E1). El servidor aplica además RN01, RN03 y RN04. */
function validar(valores, conSelectorMedico) {
  const errores = {}
  const datos = periodo(valores)

  if (conSelectorMedico && !valores.id_medico) errores.id_medico = 'Seleccione el médico.'
  if (!valores.desde) errores.fecha_inicio = 'Indique cuándo empieza la licencia.'
  if (!valores.hasta) errores.fecha_fin = 'Indique cuándo termina la licencia.'
  else if (datos && datos.fecha_fin <= datos.fecha_inicio) errores.fecha_fin = 'La licencia debe terminar después de empezar.'
  if (valores.motivo.trim().length < 3) errores.motivo = 'Indique el motivo (al menos 3 caracteres).'

  return errores
}

/**
 * Alta y modificación de una licencia (CU10). Mientras se completan las fechas
 * muestra las citas pendientes que quedarían dentro (RN05).
 *
 * @param {object | null} licencia  null para registrar una nueva.
 * @param {{ id: number, nombre_completo: string, codigo: string }[] | null} medicos  Solo para el Administrador.
 */
export function LicenciaFormModal({ licencia, medicos, idMedicoInicial, onCerrar, onGuardado }) {
  const esNueva = licencia === null
  // RN04: si la licencia ya empezó, su inicio no se puede cambiar.
  const inicioBloqueado = licencia?.estado === 'vigente'
  const conSelectorMedico = esNueva && medicos !== null

  const [valores, setValores] = useState(() => valoresIniciales(licencia, idMedicoInicial))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [citas, setCitas] = useState({ clave: '', lista: [] })

  // Vista previa de citas afectadas, cuando el periodo está completo y es coherente.
  const datosPeriodo = periodo(valores)
  const idMedico = esNueva ? valores.id_medico : licencia.medico.id
  const consultaCitas = useDebounce(
    datosPeriodo && datosPeriodo.fecha_fin > datosPeriodo.fecha_inicio && (!conSelectorMedico || idMedico)
      ? JSON.stringify({ ...datosPeriodo, ...(medicos !== null ? { id_medico: idMedico } : {}) })
      : '',
  )

  useEffect(() => {
    if (!consultaCitas) return undefined
    let vigente = true

    obtenerCitasAfectadas(JSON.parse(consultaCitas))
      .then((lista) => vigente && setCitas({ clave: consultaCitas, lista }))
      // Un periodo que el servidor rechaza se informa al guardar; aquí basta con no mostrar citas.
      .catch(() => vigente && setCitas({ clave: consultaCitas, lista: [] }))

    return () => {
      vigente = false
    }
  }, [consultaCitas])

  const citasVisibles = consultaCitas && citas.clave === consultaCitas ? citas.lista : []

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => {
      const nuevos = { ...actuales, [name]: value }
      // Si el inicio pasa a ser posterior al fin, el fin lo acompaña.
      if (name === 'desde' && nuevos.hasta < value) nuevos.hasta = value
      return nuevos
    })
    const campo = { desde: 'fecha_inicio', horaDesde: 'fecha_inicio', hasta: 'fecha_fin', horaHasta: 'fecha_fin' }[name] ?? name
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, conSelectorMedico)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { ...periodo(valores), motivo: valores.motivo.trim(), ...(conSelectorMedico ? { id_medico: Number(valores.id_medico) } : {}) }

    setEnviando(true)
    try {
      onGuardado(esNueva ? await crearLicencia(datos) : await actualizarLicencia(licencia.id, datos))
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const porCampo = primerErrorPorCampo(error.errors)
        setErrores(porCampo)
        // Reglas que no son de un campo (p. ej. licencia finalizada, RN04) se muestran arriba.
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
      titulo={esNueva ? 'Registrar licencia' : 'Editar licencia'}
      descripcion="Durante la licencia los turnos del médico no se ofrecen para reservar."
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNueva ? 'Registrar licencia' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="sr-only">Datos de la licencia</legend>

          {conSelectorMedico && (
            <Select
              etiqueta="Médico"
              name="id_medico"
              value={valores.id_medico}
              onChange={manejarCambio}
              error={errores.id_medico}
              opciones={[
                { valor: '', etiqueta: 'Seleccione un médico' },
                ...medicos.filter((medico) => medico.activo).map((medico) => ({ valor: medico.id, etiqueta: `${medico.nombre_completo} (${medico.codigo})` })),
              ]}
            />
          )}
          {!esNueva && (
            <p className="text-sm">
              <span className="text-suave">Médico:</span> {licencia.medico.nombre_completo} ({licencia.medico.codigo})
            </p>
          )}

          <Toggle
            etiqueta="Días completos"
            descripcion="Bloquea toda la agenda de los días elegidos. Desactívelo para indicar horas."
            activo={valores.diasCompletos}
            onCambiar={(activo) => setValores((actuales) => ({ ...actuales, diasCompletos: activo }))}
            disabled={enviando || inicioBloqueado}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              etiqueta="Desde"
              name="desde"
              type="date"
              value={valores.desde}
              min={inicioBloqueado ? undefined : fechaISO()}
              onChange={manejarCambio}
              disabled={inicioBloqueado}
              error={errores.fecha_inicio}
            />
            {!valores.diasCompletos && (
              <Input etiqueta="Hora de inicio" name="horaDesde" type="time" value={valores.horaDesde} onChange={manejarCambio} disabled={inicioBloqueado} />
            )}
            <Input
              etiqueta="Hasta"
              name="hasta"
              type="date"
              value={valores.hasta}
              min={valores.desde || fechaISO()}
              onChange={manejarCambio}
              error={errores.fecha_fin}
            />
            {!valores.diasCompletos && <Input etiqueta="Hora de fin" name="horaHasta" type="time" value={valores.horaHasta} onChange={manejarCambio} />}
          </div>
          {inicioBloqueado && <p className="text-xs text-suave">La licencia ya empezó: solo puede cambiar su fin (por ejemplo, si el médico vuelve antes).</p>}

          <div className="flex flex-col gap-2">
            <Textarea
              etiqueta="Motivo"
              name="motivo"
              value={valores.motivo}
              maxLength={255}
              onChange={manejarCambio}
              error={errores.motivo}
              placeholder="Por ejemplo: vacaciones anuales"
            />
            <div className="flex flex-wrap gap-2">
              {MOTIVOS_FRECUENTES.map((motivo) => (
                <button
                  key={motivo}
                  type="button"
                  onClick={() => manejarCambio({ target: { name: 'motivo', value: motivo } })}
                  className="cursor-pointer rounded-full border border-borde px-3 py-1 text-xs hover:border-primario"
                >
                  {motivo}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <CitasAfectadas citas={citasVisibles} />
      </form>
    </Modal>
  )
}
