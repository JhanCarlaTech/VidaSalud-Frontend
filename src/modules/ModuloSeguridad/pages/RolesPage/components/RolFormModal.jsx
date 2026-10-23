import { useState } from 'react'
import { primerErrorPorCampo } from '../../../../../core/api/error-handler'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Input } from '../../../../../shared/components/ui/Input'
import { Modal } from '../../../../../shared/components/ui/Modal'
import { GRUPO_PERMISO, PERMISOS_OBLIGATORIOS_ADMIN, ROLES } from '../../../../../shared/utils/constants'
import { etiquetaRol, formatearPermiso } from '../../../../../shared/utils/formatters'
import { actualizarRol, crearRol } from '../../../services/rol.service'

const ID_FORMULARIO = 'formulario-rol'
const PATRON_NOMBRE = /^[\p{L}\s]+$/u // RN01

/**
 * Agrupa los permisos por módulo según el prefijo de su acción.
 * @returns {[string, object[]][]}  [nombreDelGrupo, permisos]
 */
function agruparPermisos(permisos) {
  const grupos = new Map()

  for (const permiso of permisos) {
    const prefijo = permiso.accion.split('_')[0]
    const grupo = GRUPO_PERMISO[prefijo] ?? formatearPermiso(prefijo)
    grupos.set(grupo, [...(grupos.get(grupo) ?? []), permiso])
  }

  return [...grupos.entries()]
}

/** Validación en el cliente (E1). El servidor vuelve a validar siempre. */
function validar({ nombre, descripcion }) {
  const errores = {}
  const limpio = nombre.trim()

  if (!limpio) errores.nombre = 'El nombre del rol es obligatorio.'
  else if (limpio.length > 50) errores.nombre = 'El nombre no puede superar los 50 caracteres.'
  else if (!PATRON_NOMBRE.test(limpio)) errores.nombre = 'El nombre solo puede contener letras y espacios.'

  if (descripcion.length > 255) errores.descripcion = 'La descripción no puede superar los 255 caracteres.'

  return errores
}

/**
 * Alta y edición de un rol con la asignación de sus permisos (CU03).
 * @param {object | null} rol  null para registrar uno nuevo.
 */
export function RolFormModal({ rol, permisos, onCerrar, onGuardado }) {
  const esNuevo = rol === null
  const esAdministrador = rol?.nombre === ROLES.ADMINISTRADOR
  const [valores, setValores] = useState({
    nombre: rol?.nombre ?? '',
    descripcion: rol?.descripcion ?? '',
    permisos: rol?.permisos.map((permiso) => permiso.id) ?? [],
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  /** RN03: permisos que el Administrador no puede perder. */
  const esObligatorio = (permiso) => esAdministrador && PERMISOS_OBLIGATORIOS_ADMIN.includes(permiso.accion)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  function alternarPermiso(idPermiso) {
    setValores((actuales) => ({
      ...actuales,
      permisos: actuales.permisos.includes(idPermiso)
        ? actuales.permisos.filter((id) => id !== idPermiso)
        : [...actuales.permisos, idPermiso],
    }))
    setErrores((actuales) => ({ ...actuales, permisos: undefined }))
  }

  /** Marca todo el grupo, o lo desmarca si ya estaba completo (sin tocar los obligatorios). */
  function alternarGrupo(permisosGrupo) {
    const editables = permisosGrupo.filter((permiso) => !esObligatorio(permiso)).map((permiso) => permiso.id)
    const todosMarcados = editables.every((id) => valores.permisos.includes(id))

    setValores((actuales) => ({
      ...actuales,
      permisos: todosMarcados
        ? actuales.permisos.filter((id) => !editables.includes(id))
        : [...new Set([...actuales.permisos, ...editables])],
    }))
    setErrores((actuales) => ({ ...actuales, permisos: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    const datos = { ...valores, nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() || null }

    setEnviando(true)
    try {
      const respuesta = esNuevo ? await crearRol(datos) : await actualizarRol(rol.id, datos)
      // Se pasa el rol original: la sesión del usuario aún tiene su nombre anterior.
      onGuardado(respuesta.message, rol)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      titulo={esNuevo ? 'Nuevo rol' : `Editar rol: ${etiquetaRol(rol.nombre)}`}
      descripcion="Marque las acciones que podrán realizar los usuarios con este rol."
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form={ID_FORMULARIO} cargando={enviando}>
            {esNuevo ? 'Registrar rol' : 'Guardar cambios'}
          </Button>
        </>
      }
    >
      <form id={ID_FORMULARIO} onSubmit={manejarEnvio} noValidate className="flex flex-col gap-6">
        {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

        <fieldset className="flex flex-col gap-4" disabled={enviando}>
          <legend className="sr-only">Datos del rol</legend>
          <div className="flex flex-col gap-1">
            <Input
              etiqueta="Nombre"
              name="nombre"
              value={valores.nombre}
              onChange={manejarCambio}
              error={errores.nombre}
              disabled={rol?.es_sistema}
              autoFocus={!rol?.es_sistema}
            />
            {rol?.es_sistema && <p className="text-xs text-suave">Los roles del sistema no se pueden renombrar.</p>}
          </div>
          <Input
            etiqueta="Descripción (opcional)"
            name="descripcion"
            value={valores.descripcion}
            onChange={manejarCambio}
            error={errores.descripcion}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4 border-t border-borde pt-5" disabled={enviando}>
          <legend className="sr-only">Permisos</legend>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-semibold">Permisos</h3>
            <span className="text-xs text-suave">
              {valores.permisos.length} de {permisos.length} seleccionados
            </span>
          </div>

          {agruparPermisos(permisos).map(([grupo, permisosGrupo]) => (
            <section key={grupo} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-xs font-medium tracking-wider text-suave uppercase">{grupo}</h4>
                <button
                  type="button"
                  onClick={() => alternarGrupo(permisosGrupo)}
                  className="cursor-pointer text-xs font-semibold text-suave underline-offset-2 hover:text-texto hover:underline"
                >
                  {permisosGrupo.every((p) => esObligatorio(p) || valores.permisos.includes(p.id)) ? 'Quitar todos' : 'Seleccionar todos'}
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {permisosGrupo.map((permiso) => {
                  const marcado = valores.permisos.includes(permiso.id)
                  const obligatorio = esObligatorio(permiso)

                  return (
                    <li key={permiso.id}>
                      <label
                        className={`flex items-start gap-3 rounded-sm border px-4 py-3 ${marcado ? 'border-primario' : 'border-borde'} ${obligatorio ? 'cursor-not-allowed bg-superficie' : 'cursor-pointer hover:border-sutil'}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 accent-primario"
                          checked={marcado}
                          onChange={() => alternarPermiso(permiso.id)}
                          disabled={obligatorio}
                        />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{permiso.descripcion ?? formatearPermiso(permiso.accion)}</span>
                          <span className="text-xs text-suave">
                            {obligatorio ? 'Obligatorio para el Administrador.' : <code>{permiso.accion}</code>}
                          </span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          {errores.permisos && <p className="text-xs text-peligro">{errores.permisos}</p>}
        </fieldset>
      </form>
    </Modal>
  )
}
