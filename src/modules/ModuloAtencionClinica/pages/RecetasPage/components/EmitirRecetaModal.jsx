import { useId, useState } from 'react'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { formatearFechaHora } from '../../../../../shared/utils/formatters'
import { emitirReceta } from '../../../services/recetas.service'

const ID_FORMULARIO = 'formulario-receta'
/** RecetaRequest::MAXIMO_MEDICAMENTOS y DURACION_MAXIMA_DIAS. */
const MAXIMO_MEDICAMENTOS = 15
const DURACION_MAXIMA_DIAS = 365
const FRECUENCIAS_FRECUENTES = ['Cada 4 horas', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas', 'Antes de dormir', 'Solo si hay dolor']

// Clave estable de cada línea para React (no se envía al servidor).
let ultimaClave = 0
const lineaVacia = () => ({ clave: ++ultimaClave, medicamento: '', dosis: '', frecuencia: '', duracion_dias: '' })
const estaVacia = (linea) => !linea.medicamento.trim() && !linea.dosis.trim() && !linea.frecuencia.trim() && !String(linea.duracion_dias).trim()

/** Validación en el cliente (E1). Devuelve { general, lineas: { [indice]: { campo: mensaje } } }. */
function validar(lineas) {
  const errores = { general: '', lineas: {} }
  const completas = lineas.filter((linea) => !estaVacia(linea))
  if (completas.length === 0) errores.general = 'Agregue al menos un medicamento.'

  const vistos = new Map()
  lineas.forEach((linea, indice) => {
    if (estaVacia(linea)) return
    const propios = {}
    const duracion = Number(linea.duracion_dias)

    if (!linea.medicamento.trim()) propios.medicamento = 'Indique el medicamento.'
    if (!linea.dosis.trim()) propios.dosis = 'Indique la dosis.'
    if (!linea.frecuencia.trim()) propios.frecuencia = 'Indique la frecuencia.'
    if (!Number.isInteger(duracion) || duracion < 1) propios.duracion_dias = 'Al menos 1 día.'
    else if (duracion > DURACION_MAXIMA_DIAS) propios.duracion_dias = `Máximo ${DURACION_MAXIMA_DIAS} días.`

    // RN02: el mismo medicamento no se repite en la receta.
    const nombre = linea.medicamento.trim().toLowerCase()
    if (nombre && vistos.has(nombre)) propios.medicamento = `Ya figura en la línea ${vistos.get(nombre) + 1}.`
    else if (nombre) vistos.set(nombre, indice)

    if (Object.keys(propios).length > 0) errores.lineas[indice] = propios
  })

  return errores
}

/**
 * Convierte los errores del servidor ('medicamentos.1.dosis') en errores por línea.
 * El servidor numera solo las líneas enviadas (sin las vacías), por eso se traduce el índice.
 */
function erroresDelServidor(errores, indicesEnviados) {
  const resultado = { general: '', lineas: {} }

  for (const [clave, mensajes] of Object.entries(errores)) {
    const coincidencia = clave.match(/^medicamentos\.(\d+)\.(\w+)$/)
    if (coincidencia) {
      const indice = indicesEnviados[Number(coincidencia[1])]
      resultado.lineas[indice] = { ...resultado.lineas[indice], [coincidencia[2]]: mensajes[0] }
    } else {
      resultado.general ||= mensajes[0]
    }
  }

  return resultado
}

/**
 * Emisión de una receta para una consulta del médico (CU18). Una vez emitida no se modifica (RN06).
 * @param {(receta: object, mensaje: string) => void} onEmitida
 */
export function EmitirRecetaModal({ consulta, onCerrar, onEmitida }) {
  const idSugerencias = useId()
  const [lineas, setLineas] = useState(() => [lineaVacia()])
  const [indicaciones, setIndicaciones] = useState('')
  const [errores, setErrores] = useState({ general: '', lineas: {} })
  const [enviando, setEnviando] = useState(false)

  function cambiarLinea(indice, campo, valor) {
    setLineas((actuales) => actuales.map((linea, i) => (i === indice ? { ...linea, [campo]: valor } : linea)))
    setErrores((actuales) => ({ ...actuales, lineas: { ...actuales.lineas, [indice]: { ...actuales.lineas[indice], [campo]: undefined } } }))
  }

  function agregarLinea() {
    setLineas((actuales) => [...actuales, lineaVacia()])
  }

  function quitarLinea(indice) {
    setLineas((actuales) => (actuales.length === 1 ? [lineaVacia()] : actuales.filter((_, i) => i !== indice)))
    setErrores({ general: '', lineas: {} })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()

    const locales = validar(lineas)
    setErrores(locales)
    if (locales.general || Object.keys(locales.lineas).length > 0) return

    const indicesEnviados = lineas.map((linea, indice) => (estaVacia(linea) ? null : indice)).filter((indice) => indice !== null)
    const datos = {
      indicaciones_generales: indicaciones,
      medicamentos: indicesEnviados.map((indice) => {
        const { medicamento, dosis, frecuencia, duracion_dias } = lineas[indice]
        return { medicamento, dosis, frecuencia, duracion_dias: Number(duracion_dias) }
      }),
    }

    setEnviando(true)
    try {
      const respuesta = await emitirReceta(consulta.id, datos)
      onEmitida(respuesta.data, respuesta.message)
    } catch (error) {
      setErrores(error.status === 422 && error.errors ? erroresDelServidor(error.errors, indicesEnviados) : { general: error.message, lineas: {} })
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      ancho="xl"
      titulo="Emitir receta"
      descripcion={`${consulta.paciente.nombre_completo} · ${consulta.nro_expediente} · atendido el ${formatearFechaHora(consulta.fecha_atencion)}`}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            Emitir receta
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errores.general && <Alert variante="error">{errores.general}</Alert>}

        <datalist id={idSugerencias}>
          {FRECUENCIAS_FRECUENTES.map((frecuencia) => (
            <option key={frecuencia} value={frecuencia} />
          ))}
        </datalist>

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="mb-2 text-sm font-semibold">Medicamentos</legend>

          {lineas.map((linea, indice) => {
            const propios = errores.lineas[indice] ?? {}
            return (
              <div key={linea.clave} className="grid gap-3 rounded-sm border border-borde p-4 sm:grid-cols-[2fr_1fr_1.5fr_0.8fr_auto] sm:items-start">
                <Input
                  etiqueta={`Medicamento ${indice + 1}`}
                  value={linea.medicamento}
                  maxLength={150}
                  placeholder="Ej.: Amoxicilina"
                  onChange={(evento) => cambiarLinea(indice, 'medicamento', evento.target.value)}
                  error={propios.medicamento}
                />
                <Input
                  etiqueta="Dosis"
                  value={linea.dosis}
                  maxLength={100}
                  placeholder="500 mg"
                  onChange={(evento) => cambiarLinea(indice, 'dosis', evento.target.value)}
                  error={propios.dosis}
                />
                <Input
                  etiqueta="Frecuencia"
                  value={linea.frecuencia}
                  maxLength={100}
                  list={idSugerencias}
                  placeholder="Cada 8 horas"
                  onChange={(evento) => cambiarLinea(indice, 'frecuencia', evento.target.value)}
                  error={propios.frecuencia}
                />
                <Input
                  etiqueta="Días"
                  type="number"
                  min={1}
                  max={DURACION_MAXIMA_DIAS}
                  value={linea.duracion_dias}
                  onChange={(evento) => cambiarLinea(indice, 'duracion_dias', evento.target.value)}
                  error={propios.duracion_dias}
                />
                <div className="flex sm:pt-7">
                  <Button variante="secundario" tamano="sm" onClick={() => quitarLinea(indice)} aria-label={`Quitar el medicamento ${indice + 1}`}>
                    Quitar
                  </Button>
                </div>
              </div>
            )
          })}

          <div>
            <Button variante="secundario" tamano="sm" onClick={agregarLinea} disabled={lineas.length >= MAXIMO_MEDICAMENTOS}>
              + Agregar medicamento
            </Button>
            {lineas.length >= MAXIMO_MEDICAMENTOS && <span className="ml-3 text-xs text-suave">Máximo {MAXIMO_MEDICAMENTOS} por receta.</span>}
          </div>
        </fieldset>

        <Textarea
          etiqueta="Indicaciones generales (opcional)"
          value={indicaciones}
          maxLength={2000}
          placeholder="Reposo, dieta, signos de alarma, próximo control…"
          onChange={(evento) => setIndicaciones(evento.target.value)}
          disabled={enviando}
        />

        <p className="text-xs text-suave">Una vez emitida, la receta no se puede modificar. Si hay un error, emita una nueva.</p>
      </form>
    </Modal>
  )
}
