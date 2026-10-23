import { useId } from 'react'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import { Toggle } from '../../../shared/components/ui/Toggle'
import { fechaISO } from '../../../shared/utils/formatters'
import { CONTACTO_VACIO, OPCIONES_TIPO_SANGRE, PARENTESCOS_SUGERIDOS } from '../utils/validacionPaciente'

/**
 * Datos médicos base: fecha de nacimiento y tipo de sangre (CU11, RN03–RN04).
 * @param {boolean} conFechaNacimiento  false en "Mi ficha": el paciente no la modifica (RN08).
 */
export function CamposDatosMedicos({ valores, errores, onCambio, conFechaNacimiento = true, deshabilitado = false }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2" disabled={deshabilitado}>
      <legend className="sr-only">Datos médicos base</legend>
      {conFechaNacimiento && (
        <Input
          etiqueta="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          max={fechaISO(-1)}
          min="1900-01-02"
          value={valores.fecha_nacimiento}
          onChange={onCambio}
          error={errores.fecha_nacimiento}
        />
      )}
      <Select
        etiqueta="Tipo de sangre"
        name="tipo_sangre"
        value={valores.tipo_sangre}
        onChange={onCambio}
        opciones={OPCIONES_TIPO_SANGRE}
        error={errores.tipo_sangre}
      />
    </fieldset>
  )
}

/**
 * Contacto de emergencia opcional (CU11, RN05). Un interruptor indica si se registra.
 * @param {object | null} contacto  null cuando no hay contacto.
 * @param {(contacto: object | null) => void} onCambio
 */
export function CamposContactoEmergencia({ contacto, errores, onCambio, deshabilitado = false }) {
  const idSugerencias = useId()

  function cambiarCampo(evento) {
    onCambio({ ...contacto, [evento.target.name]: evento.target.value })
  }

  return (
    <fieldset className="flex flex-col gap-4" disabled={deshabilitado}>
      <legend className="sr-only">Contacto de emergencia</legend>
      <Toggle
        etiqueta="Contacto de emergencia"
        descripcion="Persona a la que la clínica puede llamar en caso de urgencia."
        activo={contacto !== null}
        onCambiar={(activo) => onCambio(activo ? { ...CONTACTO_VACIO } : null)}
        disabled={deshabilitado}
      />

      {contacto !== null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input etiqueta="Nombre" name="nombre" value={contacto.nombre} onChange={cambiarCampo} error={errores['contacto.nombre']} />
          <Input etiqueta="Apellido" name="apellido" value={contacto.apellido} onChange={cambiarCampo} error={errores['contacto.apellido']} />
          <Input
            etiqueta="Parentesco"
            name="parentesco"
            list={idSugerencias}
            placeholder="Ej.: Madre"
            value={contacto.parentesco}
            onChange={cambiarCampo}
            error={errores['contacto.parentesco']}
          />
          <datalist id={idSugerencias}>
            {PARENTESCOS_SUGERIDOS.map((parentesco) => (
              <option key={parentesco} value={parentesco} />
            ))}
          </datalist>
          <Input etiqueta="Teléfono" name="telefono" type="tel" value={contacto.telefono} onChange={cambiarCampo} error={errores['contacto.telefono']} />
        </div>
      )}
    </fieldset>
  )
}
