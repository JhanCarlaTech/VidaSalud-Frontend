import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { CamposContrasena, CamposDatosPersonales } from '../../../../ModuloSeguridad/components/CamposCuenta'
import {
  datosCuentaParaEnviar,
  datosPersonalesIniciales,
  validarDatosCuenta,
} from '../../../../ModuloSeguridad/utils/validacionCuenta'
import { CamposContactoEmergencia, CamposDatosMedicos } from '../../../components/CamposPaciente'
import { actualizarPaciente, crearPaciente } from '../../../services/pacientes.service'
import { contactoParaEnviar, validarContacto, validarFechaNacimiento } from '../../../utils/validacionPaciente'

const ID_FORMULARIO = 'formulario-paciente'

/** Validación en el cliente (E1). El servidor vuelve a validar siempre. */
function validar(valores, contacto, esNuevo) {
  const errores = { ...validarDatosCuenta(valores, esNuevo), ...validarContacto(contacto) }
  const errorFecha = validarFechaNacimiento(valores.fecha_nacimiento)
  if (errorFecha) errores.fecha_nacimiento = errorFecha
  return errores
}

/**
 * Registro y modificación de un paciente por el personal (CU11). Al registrar se crean
 * el usuario, el paciente, su contacto y el rol Paciente en una transacción.
 * @param {object | null} paciente  null para registrar uno nuevo.
 */
export function PacienteFormModal({ paciente, onCerrar, onGuardado }) {
  const esNuevo = paciente === null
  const [valores, setValores] = useState(() => ({
    ...datosPersonalesIniciales(paciente?.usuario),
    fecha_nacimiento: paciente?.fecha_nacimiento ?? '',
    tipo_sangre: paciente?.tipo_sangre ?? '',
  }))
  const [contacto, setContacto] = useState(paciente?.contacto ?? null)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function cambiarContacto(nuevo) {
    setContacto(nuevo)
    setErrores((actuales) => Object.fromEntries(Object.entries(actuales).filter(([campo]) => !campo.startsWith('contacto'))))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, contacto, esNuevo)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = {
      ...datosCuentaParaEnviar(valores),
      tipo_sangre: valores.tipo_sangre || null,
      contacto: contactoParaEnviar(contacto),
    }

    setEnviando(true)
    try {
      const respuesta = esNuevo ? await crearPaciente(datos) : await actualizarPaciente(paciente.id, datos)
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
      titulo={esNuevo ? 'Nuevo paciente' : 'Editar paciente'}
      descripcion={esNuevo ? 'Se creará su cuenta de acceso con el rol Paciente.' : `${paciente.usuario.nombre_completo} · ${paciente.codigo}`}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNuevo ? 'Registrar paciente' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <CamposDatosPersonales valores={valores} errores={errores} onCambio={manejarCambio} deshabilitado={enviando} />

        <section className="flex flex-col gap-4 border-t border-borde pt-5">
          <h3 className="text-sm font-semibold">Datos médicos base</h3>
          <CamposDatosMedicos valores={valores} errores={errores} onCambio={manejarCambio} deshabilitado={enviando} />
        </section>

        <section className="border-t border-borde pt-5">
          <CamposContactoEmergencia contacto={contacto} errores={errores} onCambio={cambiarContacto} deshabilitado={enviando} />
        </section>

        <CamposContrasena valores={valores} errores={errores} onCambio={manejarCambio} esNuevo={esNuevo} deshabilitado={enviando} />
      </form>
    </Modal>
  )
}
