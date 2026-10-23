import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import { OPCIONES_SEXO } from '../../../shared/utils/constants'

/**
 * Campos de datos personales de una cuenta. Los usan los formularios de
 * usuarios (CU02) y de médicos (CU08).
 */
export function CamposDatosPersonales({ valores, errores, onCambio, deshabilitado = false }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2" disabled={deshabilitado}>
      <legend className="sr-only">Datos personales</legend>
      <Input etiqueta="Nombre" name="nombre" value={valores.nombre} onChange={onCambio} error={errores.nombre} autoFocus />
      <Input etiqueta="Apellido" name="apellido" value={valores.apellido} onChange={onCambio} error={errores.apellido} />
      <Input etiqueta="CI" name="ci" value={valores.ci} onChange={onCambio} error={errores.ci} />
      <Input etiqueta="Teléfono (opcional)" name="telefono" type="tel" value={valores.telefono} onChange={onCambio} error={errores.telefono} />
      <div className="sm:col-span-2">
        <Input etiqueta="Correo electrónico" name="correo" type="email" autoComplete="off" value={valores.correo} onChange={onCambio} error={errores.correo} />
      </div>
      <Select etiqueta="Sexo" name="sexo" value={valores.sexo} onChange={onCambio} opciones={OPCIONES_SEXO} error={errores.sexo} />
    </fieldset>
  )
}

/**
 * Contraseña y su confirmación: inicial al registrar u opcional (restablecer) al editar.
 */
export function CamposContrasena({ valores, errores, onCambio, esNuevo, deshabilitado = false }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-borde pt-5" disabled={deshabilitado}>
      <legend className="sr-only">Contraseña</legend>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{esNuevo ? 'Contraseña inicial' : 'Restablecer contraseña'}</h3>
        <p className="text-xs text-suave">
          {esNuevo ? 'Mínimo 8 caracteres, con letras y números.' : 'Déjela en blanco para conservar la contraseña actual.'}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          etiqueta="Contraseña"
          name="contrasena"
          type="password"
          autoComplete="new-password"
          value={valores.contrasena}
          onChange={onCambio}
          error={errores.contrasena}
        />
        <Input
          etiqueta="Confirmar contraseña"
          name="contrasena_confirmation"
          type="password"
          autoComplete="new-password"
          value={valores.contrasena_confirmation}
          onChange={onCambio}
          error={errores.contrasena_confirmation}
        />
      </div>
    </fieldset>
  )
}
