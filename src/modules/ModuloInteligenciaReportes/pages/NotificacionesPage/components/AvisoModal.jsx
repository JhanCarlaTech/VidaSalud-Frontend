import { useEffect, useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Select } from '../../../../../shared/components/ui/Select'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../../shared/hooks/useDebounce'
import { formatearDia } from '../../../../../shared/utils/formatters'
import { listarCitas } from '../../../../ModuloOperacionCitas/services/citas.service'
import { listarPacientes } from '../../../../ModuloPacientes/services/pacientes.service'
import { enviarAviso } from '../../../services/notificaciones.service'

const ID_FORMULARIO = 'formulario-aviso'
const MINIMO_BUSQUEDA = 2

/**
 * Aviso manual de Recepción a un paciente (CU20, RN05), opcionalmente sobre una de sus
 * próximas citas. Se entrega en la bandeja y, si el paciente lo permite, por correo.
 */
export function AvisoModal({ onCerrar, onEnviado }) {
  const [busqueda, setBusqueda] = useState('')
  const [paciente, setPaciente] = useState(null)
  const [idCita, setIdCita] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [resultados, setResultados] = useState({ termino: '', items: [] })

  const termino = useDebounce(busqueda.trim())

  useEffect(() => {
    if (paciente || termino.length < MINIMO_BUSQUEDA) return undefined
    let vigente = true

    listarPacientes({ buscar: termino, activo: '1' })
      .then((datos) => vigente && setResultados({ termino, items: datos.items }))
      .catch(() => vigente && setResultados({ termino, items: [] }))

    return () => {
      vigente = false
    }
  }, [termino, paciente])

  // Próximas citas del paciente elegido, para vincular el aviso a una de ellas.
  const citas = useConsulta(
    () => (paciente ? listarCitas({ buscar: paciente.codigo, periodo: 'proximas' }) : Promise.resolve({ items: [] })),
    String(paciente?.id ?? ''),
  )
  const citasDelPaciente = (citas.datos?.items ?? []).filter((cita) => cita.paciente.id === paciente?.id)

  function elegir(elegido) {
    setPaciente(elegido)
    setIdCita('')
    setErrores((actuales) => ({ ...actuales, id_paciente: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const locales = {}
    if (!paciente) locales.id_paciente = 'Seleccione el paciente.'
    if (mensaje.trim().length < 5) locales.mensaje = 'El mensaje debe tener al menos 5 caracteres.'
    setErrores(locales)
    if (Object.keys(locales).length > 0) return

    setEnviando(true)
    try {
      const respuesta = await enviarAviso({ id_paciente: paciente.id, id_cita: idCita ? Number(idCita) : null, mensaje: mensaje.trim() })
      onEnviado(respuesta.message)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  const mostrarResultados = !paciente && resultados.termino === termino && termino.length >= MINIMO_BUSQUEDA

  return (
    <Modal
      abierto
      titulo="Nuevo aviso"
      descripcion="Llega a la bandeja del paciente y, si lo permite, también a su correo."
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            Enviar aviso
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        {paciente ? (
          <div className="flex items-center justify-between gap-3 rounded-sm border border-borde px-4 py-3">
            <div className="flex flex-col">
              <span className="font-semibold">{paciente.usuario.nombre_completo}</span>
              <span className="text-sm text-suave">
                {paciente.codigo} · CI {paciente.usuario.ci}
              </span>
            </div>
            <Button variante="secundario" tamano="sm" onClick={() => setPaciente(null)} disabled={enviando}>
              Cambiar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              etiqueta="Paciente"
              type="search"
              placeholder="Nombre, CI o código"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              error={errores.id_paciente}
            />
            {mostrarResultados && resultados.items.length === 0 && <p className="text-sm text-suave">Ningún paciente activo coincide.</p>}
            {mostrarResultados && resultados.items.length > 0 && (
              <ul className="flex max-h-56 flex-col divide-y divide-borde overflow-y-auto rounded-sm border border-borde">
                {resultados.items.map((opcion) => (
                  <li key={opcion.id}>
                    <button type="button" onClick={() => elegir(opcion)} className="flex w-full cursor-pointer flex-col px-4 py-2 text-left hover:bg-superficie">
                      <span className="font-medium">{opcion.usuario.nombre_completo}</span>
                      <span className="text-xs text-suave">
                        {opcion.codigo} · CI {opcion.usuario.ci}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {paciente && (
          <Select
            etiqueta="Cita relacionada (opcional)"
            value={idCita}
            onChange={(evento) => setIdCita(evento.target.value)}
            error={errores.id_cita}
            disabled={enviando || citas.cargando}
            opciones={[
              { valor: '', etiqueta: citas.cargando ? 'Cargando citas…' : citasDelPaciente.length ? 'Ninguna' : 'El paciente no tiene próximas citas' },
              ...citasDelPaciente.map((cita) => ({
                valor: cita.id,
                etiqueta: `${cita.codigo} · ${formatearDia(cita.fecha, { dateStyle: 'medium' })} ${cita.hora_inicio} · Dr(a). ${cita.medico.nombre_completo}`,
              })),
            ]}
          />
        )}

        <Textarea
          etiqueta="Mensaje"
          value={mensaje}
          maxLength={1000}
          placeholder="Por ejemplo: traiga sus estudios anteriores a la consulta."
          onChange={(evento) => {
            setMensaje(evento.target.value)
            setErrores((actuales) => ({ ...actuales, mensaje: undefined }))
          }}
          error={errores.mensaje}
          disabled={enviando}
        />
      </form>
    </Modal>
  )
}
