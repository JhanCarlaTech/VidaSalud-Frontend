import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { CamposContrasena, CamposDatosPersonales } from '../../../../ModuloSeguridad/components/CamposCuenta'
import {
  datosCuentaParaEnviar,
  datosPersonalesIniciales,
  validarDatosCuenta,
} from '../../../../ModuloSeguridad/utils/validacionCuenta'
import { actualizarMedico, crearMedico } from '../../../services/medicos.service'

const ID_FORMULARIO = 'formulario-medico'
const PATRON_SALARIO = /^\d{1,8}(\.\d{1,2})?$/ // RN03: ≥ 0 y hasta 2 decimales

/** Validación en el cliente (E1, E3). El servidor vuelve a validar siempre. */
function validar(valores, esNuevo) {
  const errores = validarDatosCuenta(valores, esNuevo)

  if (!PATRON_SALARIO.test(String(valores.salario).trim())) {
    errores.salario = 'Ingrese un salario válido (por ejemplo, 8500 o 8500.50).'
  }
  if (valores.especialidades.length === 0) errores.especialidades = 'Asigne al menos una especialidad.'

  return errores
}

/**
 * Registro y modificación del legajo de un médico (CU08). Al registrar se crean
 * el usuario, el médico, sus especialidades y el rol Medico en una transacción.
 * @param {object | null} medico  null para registrar uno nuevo.
 * @param {object[]} especialidades  Catálogo completo (activas e inactivas).
 */
export function MedicoFormModal({ medico, especialidades, onCerrar, onGuardado }) {
  const esNuevo = medico === null
  const asignadasAlInicio = medico?.especialidades.map((especialidad) => especialidad.id) ?? []
  const [valores, setValores] = useState(() => ({
    ...datosPersonalesIniciales(medico?.usuario),
    salario: medico?.salario ?? '',
    especialidades: asignadasAlInicio,
  }))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  // RN04: se ofrecen las activas y las inactivas que el médico ya tenía.
  const disponibles = especialidades.filter((e) => e.activo || asignadasAlInicio.includes(e.id))

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function alternarEspecialidad(id) {
    setValores((actuales) => ({
      ...actuales,
      especialidades: actuales.especialidades.includes(id)
        ? actuales.especialidades.filter((actual) => actual !== id)
        : [...actuales.especialidades, id],
    }))
    setErrores((actuales) => ({ ...actuales, especialidades: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, esNuevo)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { ...datosCuentaParaEnviar(valores), salario: String(valores.salario).trim() }

    setEnviando(true)
    try {
      const respuesta = esNuevo ? await crearMedico(datos) : await actualizarMedico(medico.id, datos)
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
      titulo={esNuevo ? 'Nuevo médico' : 'Editar médico'}
      descripcion={esNuevo ? 'Se creará su cuenta de acceso con el rol Médico.' : `${medico.usuario.nombre_completo} · ${medico.codigo}`}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNuevo ? 'Registrar médico' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <CamposDatosPersonales valores={valores} errores={errores} onCambio={manejarCambio} deshabilitado={enviando} />
        <CamposContrasena valores={valores} errores={errores} onCambio={manejarCambio} esNuevo={esNuevo} deshabilitado={enviando} />

        <fieldset className="flex flex-col gap-4 border-t border-borde pt-5" disabled={enviando}>
          <legend className="sr-only">Legajo profesional</legend>
          <h3 className="text-sm font-semibold">Legajo profesional</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Input etiqueta="Código" name="codigo" value={medico?.codigo ?? 'Se asigna al registrar'} disabled readOnly />
              <p className="text-xs text-suave">Correlativo generado por el sistema.</p>
            </div>
            <Input
              etiqueta="Salario mensual (Bs)"
              name="salario"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={valores.salario}
              onChange={manejarCambio}
              error={errores.salario}
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 border-t border-borde pt-5" disabled={enviando}>
          <legend className="text-sm font-semibold">Especialidades</legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {disponibles.map((especialidad) => {
              const marcada = valores.especialidades.includes(especialidad.id)

              return (
                <li key={especialidad.id}>
                  <label
                    className={`flex h-full cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 hover:border-sutil ${marcada ? 'border-primario' : 'border-borde'}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4 accent-primario"
                      checked={marcada}
                      onChange={() => alternarEspecialidad(especialidad.id)}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{especialidad.nombre}</span>
                      {!especialidad.activo && (
                        <span className="text-xs text-suave">Inactiva: puede conservarla, pero si la quita no podrá volver a asignarla.</span>
                      )}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
          {errores.especialidades && <p className="text-xs text-peligro">{errores.especialidades}</p>}
        </fieldset>
      </form>
    </Modal>
  )
}
