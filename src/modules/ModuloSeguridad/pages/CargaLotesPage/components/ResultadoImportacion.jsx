import { Link } from 'react-router-dom'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { DataTable } from '../../../../../shared/components/ui/DataTable'
import { crearCsv, descargarArchivo } from '../../../../../shared/utils/archivos'
import { RUTAS } from '../../../../../shared/utils/constants'
import { fechaISO } from '../../../../../shared/utils/formatters'

const COLUMNAS = [
  { clave: 'fila', titulo: 'Fila', className: 'w-16 tabular-nums' },
  { clave: 'nombre_completo', titulo: 'Nombre' },
  { clave: 'correo', titulo: 'Correo' },
  {
    clave: 'contrasena_temporal',
    titulo: 'Contraseña temporal',
    render: ({ contrasena_temporal }) => <code className="rounded-lg bg-gris px-2 py-1 font-mono text-sm">{contrasena_temporal}</code>,
  },
]

/** El archivo se arma en el navegador: las contraseñas no vuelven a pedirse al servidor. */
function descargarCredenciales(tipo, credenciales) {
  const csv = crearCsv(
    ['fila', 'nombre', 'correo', 'contrasena_temporal'],
    credenciales.map((c) => [c.fila, c.nombre_completo, c.correo, c.contrasena_temporal]),
  )
  descargarArchivo(csv, `credenciales_${tipo}_${fechaISO()}.csv`)
}

/**
 * Resultado del CU04 (paso 5 del flujo). Las contraseñas temporales (RN06)
 * solo existen en esta pantalla: al salir ya no se pueden recuperar.
 */
export function ResultadoImportacion({ resultado, onNuevaCarga }) {
  const { mensaje, tipo, credenciales } = resultado

  return (
    <div className="flex flex-col gap-6">
      <Alert>{mensaje}</Alert>

      {credenciales.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Contraseñas temporales</h2>
              <p className="text-sm text-suave">
                Se generaron para las filas sin contraseña. Entréguelas a cada persona y pídale que la cambie desde su perfil.
              </p>
            </div>
            <Button onClick={() => descargarCredenciales(tipo, credenciales)}>Descargar credenciales (CSV)</Button>
          </div>

          <Alert variante="error">
            Esta es la única vez que se muestran: el sistema solo guarda la contraseña cifrada. Descárguelas antes de salir de esta
            pantalla.
          </Alert>

          <DataTable columnas={COLUMNAS} filas={credenciales} obtenerClave={(c) => c.fila} />
        </div>
      ) : (
        <p className="text-sm text-suave">Todas las cuentas usan la contraseña indicada en el archivo.</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variante="secundario" onClick={onNuevaCarga}>
          Cargar otro archivo
        </Button>
        <Link
          to={tipo === 'pacientes' ? RUTAS.PACIENTES : RUTAS.ADMIN_USUARIOS}
          className="inline-flex min-h-11 items-center rounded-lg border border-borde bg-superficie px-6 py-3 text-sm font-semibold hover:border-primario"
        >
          {tipo === 'pacientes' ? 'Ver pacientes' : 'Ver usuarios'}
        </Link>
      </div>
    </div>
  )
}
