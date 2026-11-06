import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Select } from '../../../../../shared/components/ui/Select'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { actualizarEnfermedad, crearEnfermedad } from '../../../services/enfermedades.service'
import { NIVELES_RIESGO } from '../../../utils/enfermedades'

const ID_FORMULARIO = 'formulario-enfermedad'
const OPCIONES_RIESGO = [{ valor: '', etiqueta: 'Seleccione el nivel' }, ...NIVELES_RIESGO.map((nivel) => ({ valor: nivel, etiqueta: nivel }))]

/** Validación en el cliente (E1). El servidor vuelve a validar, incluida la unicidad (RN01). */
function validar({ nombre, nivel_riesgo }) {
  const errores = {}
  const limpio = nombre.trim()

  if (!limpio) errores.nombre = 'El nombre de la enfermedad es obligatorio.'
  else if (limpio.length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  else if (!/^[\p{L}\p{N}\s\-(),.'/]+$/u.test(limpio)) errores.nombre = "El nombre solo puede contener letras, números, espacios y los signos - ( ) , . ' /"
  if (!nivel_riesgo) errores.nivel_riesgo = 'Seleccione el nivel de riesgo.'

  return errores
}

/**
 * Alta y modificación de una enfermedad del catálogo (CU12).
 * @param {object | null} enfermedad  null para registrar una nueva.
 */
export function EnfermedadFormModal({ enfermedad, onCerrar, onGuardado }) {
  const esNueva = enfermedad === null
  const [valores, setValores] = useState({
    nombre: enfermedad?.nombre ?? '',
    descripcion: enfermedad?.descripcion ?? '',
    nivel_riesgo: enfermedad?.nivel_riesgo ?? '',
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

    setEnviando(true)
    try {
      const respuesta = esNueva ? await crearEnfermedad(valores) : await actualizarEnfermedad(enfermedad.id, valores)
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
      titulo={esNueva ? 'Nueva enfermedad' : 'Editar enfermedad'}
      descripcion="Las enfermedades del catálogo se usan en los antecedentes de los pacientes."
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNueva ? 'Registrar enfermedad' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="sr-only">Datos de la enfermedad</legend>
          <Input
            etiqueta="Nombre"
            name="nombre"
            value={valores.nombre}
            maxLength={150}
            placeholder="Por ejemplo: Hipotiroidismo"
            onChange={manejarCambio}
            error={errores.nombre}
          />
          <Select etiqueta="Nivel de riesgo" name="nivel_riesgo" value={valores.nivel_riesgo} onChange={manejarCambio} opciones={OPCIONES_RIESGO} error={errores.nivel_riesgo} />
          <Textarea
            etiqueta="Descripción (opcional)"
            name="descripcion"
            value={valores.descripcion}
            maxLength={1000}
            onChange={manejarCambio}
            error={errores.descripcion}
          />
        </fieldset>
      </form>
    </Modal>
  )
}
