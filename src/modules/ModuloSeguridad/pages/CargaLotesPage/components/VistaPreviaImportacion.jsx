import { useState } from 'react'
import { Badge } from '../../../../../shared/components/ui/Badge'
import { DataTable } from '../../../../../shared/components/ui/DataTable'
import { Toggle } from '../../../../../shared/components/ui/Toggle'
import { etiquetaRol, formatearFecha } from '../../../../../shared/utils/formatters'

/** Contador del resumen de la validación. */
function Contador({ etiqueta, valor, destacado = false }) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl border px-4 py-3 ${destacado ? 'border-peligro' : 'border-borde'}`}>
      <span className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</span>
      <span className={`text-2xl font-semibold ${destacado ? 'text-peligro' : ''}`}>{valor}</span>
    </div>
  )
}

/**
 * 'AAAA-MM-DD' → '15 de abril de 1992'. Se fija el mediodía para que la zona horaria
 * no cambie el día; un valor inválido del archivo se muestra tal cual.
 */
function fechaDelArchivo(valor) {
  if (!valor) return '—'
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) ? formatearFecha(`${valor}T12:00:00`) : valor
}

/** Datos propios del tipo de carga: roles del personal o ficha del paciente. */
function DetalleFila({ tipo, datos }) {
  if (tipo === 'personal') {
    return datos.roles.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {datos.roles.map((rol) => (
          <Badge key={rol}>{etiquetaRol(rol)}</Badge>
        ))}
      </div>
    ) : (
      <span className="text-suave">—</span>
    )
  }

  return (
    <div className="flex flex-col">
      <span>{fechaDelArchivo(datos.fecha_nacimiento)}</span>
      <span className="text-suave">
        {[datos.tipo_sangre, datos.contacto && `Contacto: ${datos.contacto.nombre} (${datos.contacto.parentesco})`].filter(Boolean).join(' · ') ||
          'Sin ficha adicional'}
      </span>
    </div>
  )
}

/**
 * Vista previa de la validación del CU04 (paso 3 del flujo): resumen y tabla de
 * filas con sus errores. No se guarda nada hasta que el administrador confirma.
 */
export function VistaPreviaImportacion({ tipo, vistaPrevia }) {
  const { resumen, filas } = vistaPrevia
  const [soloErrores, setSoloErrores] = useState(resumen.con_errores > 0)
  const visibles = soloErrores ? filas.filter((fila) => Object.keys(fila.errores).length > 0) : filas

  const columnas = [
    { clave: 'fila', titulo: 'Fila', className: 'w-16 tabular-nums' },
    {
      clave: 'persona',
      titulo: tipo === 'personal' ? 'Usuario' : 'Paciente',
      render: ({ datos }) => (
        <div className="flex flex-col">
          <span className="font-semibold">{[datos.nombre, datos.apellido].filter(Boolean).join(' ') || '—'}</span>
          <span className="text-suave">{datos.correo || '—'}</span>
        </div>
      ),
    },
    { clave: 'ci', titulo: 'CI', render: ({ datos }) => datos.ci || '—' },
    {
      clave: 'detalle',
      titulo: tipo === 'personal' ? 'Roles' : 'Nacimiento y ficha',
      render: ({ datos }) => <DetalleFila tipo={tipo} datos={datos} />,
    },
    {
      clave: 'estado',
      titulo: 'Resultado',
      className: 'min-w-64',
      render: ({ errores }) => {
        const porCampo = Object.entries(errores)
        if (porCampo.length === 0) return <Badge variante="solido">Lista para importar</Badge>
        return (
          <ul className="flex list-disc flex-col gap-0.5 pl-4 text-xs text-peligro">
            {porCampo.map(([campo, mensaje]) => (
              <li key={campo}>{mensaje}</li>
            ))}
          </ul>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Contador etiqueta="Filas leídas" valor={resumen.total} />
        <Contador etiqueta="Válidas" valor={resumen.validas} />
        <Contador etiqueta="Con errores" valor={resumen.con_errores} destacado={resumen.con_errores > 0} />
      </div>

      {resumen.con_errores > 0 && (
        <Toggle
          etiqueta="Mostrar solo las filas con errores"
          descripcion="El número de fila corresponde al de la hoja de cálculo (la fila 1 son los encabezados)."
          activo={soloErrores}
          onCambiar={setSoloErrores}
        />
      )}

      <DataTable columnas={columnas} filas={visibles} obtenerClave={(fila) => fila.fila} mensajeVacio="No hay filas para mostrar." />
    </div>
  )
}
