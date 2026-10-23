import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Badge } from '../../../../../shared/components/ui/Badge'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { actualizarEspecialidad, crearEspecialidad } from '../../../services/especialidades.service'

const ID_FORMULARIO = 'formulario-especialidad'
const PATRON_NOMBRE = /^[\p{L}\s]+$/u // RN01
const MAX_NOMBRE = 100
const MAX_DESCRIPCION = 500

/** Validación en el cliente (E1). El servidor vuelve a validar siempre. */
function validar({ nombre, descripcion }) {
  const errores = {}
  const limpio = nombre.trim()

  if (!limpio) errores.nombre = 'El nombre de la especialidad es obligatorio.'
  else if (limpio.length > MAX_NOMBRE) errores.nombre = `El nombre no puede superar los ${MAX_NOMBRE} caracteres.`
  else if (!PATRON_NOMBRE.test(limpio)) errores.nombre = 'El nombre solo puede contener letras y espacios.'

  if (descripcion.length > MAX_DESCRIPCION) errores.descripcion = `La descripción no puede superar los ${MAX_DESCRIPCION} caracteres.`

  return errores
}

/**
 * Registro y modificación de una especialidad (CU07). En la edición muestra
 * los médicos que la ejercen; se asignan desde Gestionar Personal Médico (CU08).
 * @param {object | null} especialidad  null para registrar una nueva.
 */
export function EspecialidadFormModal({ especialidad, onCerrar, onGuardado }) {
  const esNueva = especialidad === null
  const [valores, setValores] = useState({
    nombre: especialidad?.nombre ?? '',
    descripcion: especialidad?.descripcion ?? '',
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() || null }

    setEnviando(true)
    try {
      const respuesta = esNueva ? await crearEspecialidad(datos) : await actualizarEspecialidad(especialidad.id, datos)
      onGuardado(respuesta.message)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      titulo={esNueva ? 'Nueva especialidad' : 'Editar especialidad'}
      descripcion={esNueva ? 'Agregue una especialidad al catálogo de la clínica.' : especialidad.nombre}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNueva ? 'Registrar especialidad' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="sr-only">Datos de la especialidad</legend>
          <Input
            etiqueta="Nombre"
            name="nombre"
            placeholder="Ej.: Dermatología"
            value={valores.nombre}
            onChange={manejarCambio}
            error={errores.nombre}
            autoFocus
          />
          <Textarea
            etiqueta="Descripción (opcional)"
            name="descripcion"
            rows={3}
            maxLength={MAX_DESCRIPCION}
            value={valores.descripcion}
            onChange={manejarCambio}
            error={errores.descripcion}
          />
        </fieldset>

        {!esNueva && (
          <section className="flex flex-col gap-3 border-t border-borde pt-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Médicos con esta especialidad</h3>
              <p className="text-xs text-suave">Se asignan desde Gestionar Personal Médico.</p>
            </div>
            {especialidad.medicos.length === 0 ? (
              <p className="text-sm text-suave">Ningún médico la ejerce todavía.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-borde rounded-sm border border-borde">
                {especialidad.medicos.map((medico) => (
                  <li key={medico.id} className="flex items-center justify-between gap-4 px-4 py-2 text-sm">
                    <span>
                      {medico.nombre_completo} <span className="text-xs text-suave">· {medico.codigo}</span>
                    </span>
                    {!medico.activo && <Badge variante="contorno">Inactivo</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </form>
    </Modal>
  )
}
