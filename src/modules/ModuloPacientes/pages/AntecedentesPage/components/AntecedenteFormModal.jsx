import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { Select } from '../../../../../shared/components/ui/Select'
import { Textarea } from '../../../../../shared/components/ui/Textarea'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { fechaISO } from '../../../../../shared/utils/formatters'
import { actualizarAntecedente, listarEnfermedades, registrarAntecedente } from '../../../services/enfermedades.service'

const ID_FORMULARIO = 'formulario-antecedente'

/** Validación en el cliente (E1). El servidor aplica además RN03 y RN04. */
function validar(valores, esNuevo, paciente) {
  const errores = {}

  if (esNuevo && !valores.id_enfermedad) errores.id_enfermedad = 'Seleccione la enfermedad.'
  if (valores.fecha_diagnostico) {
    if (valores.fecha_diagnostico > fechaISO()) errores.fecha_diagnostico = 'La fecha de diagnóstico no puede ser futura.'
    else if (paciente.fecha_nacimiento && valores.fecha_diagnostico < paciente.fecha_nacimiento) {
      errores.fecha_diagnostico = 'La fecha de diagnóstico no puede ser anterior al nacimiento del paciente.'
    }
  }

  return errores
}

/**
 * Registro y modificación de un antecedente (CU12). Al registrar solo se ofrecen las
 * enfermedades activas que el paciente aún no tiene; al editar, la enfermedad no cambia.
 *
 * @param {object | null} antecedente  null para registrar uno nuevo.
 * @param {number[]} registradas       Ids de las enfermedades que el paciente ya tiene.
 */
export function AntecedenteFormModal({ paciente, antecedente, registradas, onCerrar, onGuardado }) {
  const esNuevo = antecedente === null
  const [valores, setValores] = useState({
    id_enfermedad: '',
    fecha_diagnostico: antecedente?.fecha_diagnostico ?? '',
    observaciones: antecedente?.observaciones ?? '',
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const catalogo = useConsulta(() => (esNuevo ? listarEnfermedades({ activo: '1' }) : Promise.resolve([])), String(esNuevo))
  const disponibles = (catalogo.datos ?? []).filter((enfermedad) => !registradas.includes(enfermedad.id))

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, esNuevo, paciente)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { fecha_diagnostico: valores.fecha_diagnostico || null, observaciones: valores.observaciones }

    setEnviando(true)
    try {
      const respuesta = esNuevo
        ? await registrarAntecedente(paciente.id, { ...datos, id_enfermedad: Number(valores.id_enfermedad) })
        : await actualizarAntecedente(paciente.id, antecedente.enfermedad.id, datos)
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
      titulo={esNuevo ? 'Registrar antecedente' : 'Editar antecedente'}
      descripcion={`${paciente.nombre_completo} · ${paciente.codigo}`}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando} disabled={esNuevo && catalogo.cargando}>
            {esNuevo ? 'Registrar' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}
        {catalogo.error && <Alert variante="error">{catalogo.error}</Alert>}

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="sr-only">Datos del antecedente</legend>

          {esNuevo ? (
            <Select
              etiqueta="Enfermedad"
              name="id_enfermedad"
              value={valores.id_enfermedad}
              onChange={manejarCambio}
              error={errores.id_enfermedad}
              opciones={[
                { valor: '', etiqueta: catalogo.cargando ? 'Cargando catálogo…' : disponibles.length ? 'Seleccione una enfermedad' : 'No quedan enfermedades por registrar' },
                ...disponibles.map((enfermedad) => ({ valor: enfermedad.id, etiqueta: `${enfermedad.nombre} (riesgo ${enfermedad.nivel_riesgo?.toLowerCase() ?? 'sin definir'})` })),
              ]}
            />
          ) : (
            <p className="text-sm">
              <span className="text-suave">Enfermedad:</span> <strong className="font-semibold">{antecedente.enfermedad.nombre}</strong>
            </p>
          )}

          <Input
            etiqueta="Fecha de diagnóstico (opcional)"
            name="fecha_diagnostico"
            type="date"
            value={valores.fecha_diagnostico}
            min={paciente.fecha_nacimiento ?? undefined}
            max={fechaISO()}
            onChange={manejarCambio}
            error={errores.fecha_diagnostico}
          />
          <Textarea
            etiqueta="Observaciones (opcional)"
            name="observaciones"
            value={valores.observaciones}
            maxLength={1000}
            placeholder="Tratamiento, controles, evolución…"
            onChange={manejarCambio}
            error={errores.observaciones}
          />
        </fieldset>
      </form>
    </Modal>
  )
}
