import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { ROLES } from '../../../../../shared/utils/constants'
import { etiquetaRol } from '../../../../../shared/utils/formatters'
import { CamposContrasena, CamposDatosPersonales } from '../../../components/CamposCuenta'
import { actualizarUsuario, crearUsuario } from '../../../services/usuario.service'
import { datosCuentaParaEnviar, datosPersonalesIniciales, validarDatosCuenta } from '../../../utils/validacionCuenta'

const ID_FORMULARIO = 'formulario-usuario'

/** Validación en el cliente (E1). El servidor vuelve a validar siempre. */
function validar(valores, esNuevo) {
  const errores = validarDatosCuenta(valores, esNuevo)
  if (valores.roles.length === 0) errores.roles = 'Asigne al menos un rol.'
  return errores
}

/**
 * Motivo por el que un rol no se puede marcar o desmarcar desde aquí (RN04 y RN06),
 * o null si está disponible.
 */
function motivoBloqueo(rol, usuario, esUsuarioActual) {
  if (rol.nombre === ROLES.MEDICO && !usuario?.es_medico) return 'Se asigna al registrar el médico (Gestionar Personal Médico).'
  if (rol.nombre === ROLES.PACIENTE && !usuario?.es_paciente) return 'Se asigna al registrar el paciente (Gestionar Pacientes).'
  if (rol.nombre === ROLES.ADMINISTRADOR && esUsuarioActual) return 'No puede quitarse su propio rol de Administrador.'
  return null
}

/**
 * Alta y edición de un usuario con sus roles (CU02).
 * @param {object | null} usuario  null para registrar uno nuevo.
 */
export function UsuarioFormModal({ usuario, roles, esUsuarioActual, onCerrar, onGuardado }) {
  const esNuevo = usuario === null
  const [valores, setValores] = useState(() => ({
    ...datosPersonalesIniciales(usuario),
    roles: usuario?.roles.map((rol) => rol.id) ?? [],
  }))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function alternarRol(idRol) {
    setValores((actuales) => ({
      ...actuales,
      roles: actuales.roles.includes(idRol) ? actuales.roles.filter((id) => id !== idRol) : [...actuales.roles, idRol],
    }))
    setErrores((actuales) => ({ ...actuales, roles: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores, esNuevo)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = datosCuentaParaEnviar(valores)

    setEnviando(true)
    try {
      const respuesta = esNuevo ? await crearUsuario(datos) : await actualizarUsuario(usuario.id, datos)
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
      titulo={esNuevo ? 'Nuevo usuario' : 'Editar usuario'}
      descripcion={esNuevo ? 'Registre la cuenta y asigne sus roles.' : usuario.nombre_completo}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNuevo ? 'Registrar usuario' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <CamposDatosPersonales valores={valores} errores={errores} onCambio={manejarCambio} deshabilitado={enviando} />
        <CamposContrasena valores={valores} errores={errores} onCambio={manejarCambio} esNuevo={esNuevo} deshabilitado={enviando} />

        <fieldset className="flex flex-col gap-3 border-t border-borde pt-5" disabled={enviando} aria-describedby={errores.roles ? 'roles-error' : undefined}>
          <legend className="text-sm font-semibold">Roles</legend>
          <ul className="flex flex-col gap-2">
            {roles.map((rol) => {
              const marcado = valores.roles.includes(rol.id)
              const motivo = motivoBloqueo(rol, usuario, esUsuarioActual)

              return (
                <li key={rol.id}>
                  <label className={`flex items-start gap-3 rounded-sm border px-4 py-3 ${marcado ? 'border-primario' : 'border-borde'} ${motivo ? 'cursor-not-allowed bg-superficie' : 'cursor-pointer hover:border-sutil'}`}>
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4 accent-primario"
                      checked={marcado}
                      onChange={() => alternarRol(rol.id)}
                      disabled={Boolean(motivo)}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{etiquetaRol(rol.nombre)}</span>
                      <span className="text-xs text-suave">{motivo ?? rol.descripcion}</span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
          {errores.roles && (
            <p id="roles-error" className="text-xs text-peligro">
              {errores.roles}
            </p>
          )}
        </fieldset>
      </form>
    </Modal>
  )
}
