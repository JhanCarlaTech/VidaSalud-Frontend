import { Spinner } from './Spinner'

/**
 * Tabla de datos con estados de carga y vacío. En pantallas angostas se
 * desplaza horizontalmente dentro de su contenedor.
 *
 * @param {{ clave: string, titulo: string, render?: (fila) => any, className?: string }[]} columnas
 * @param {object[]} filas
 * @param {(fila) => string | number} obtenerClave
 */
export function DataTable({ columnas, filas, obtenerClave, cargando = false, mensajeVacio = 'No hay registros.' }) {
  return (
    <div className="relative overflow-x-auto rounded-md border border-borde bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="border-b border-borde bg-superficie">
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={`px-4 py-3 text-xs font-medium tracking-wider text-suave uppercase ${columna.className ?? ''}`}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={obtenerClave(fila)} className="border-b border-borde last:border-b-0 hover:bg-superficie">
              {columnas.map((columna) => (
                <td key={columna.clave} className={`px-4 py-3 align-middle ${columna.className ?? ''}`}>
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
            </tr>
          ))}

          {!cargando && filas.length === 0 && (
            <tr>
              <td colSpan={columnas.length} className="px-4 py-12 text-center text-suave">
                {mensajeVacio}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {cargando && (
        <div className={`grid place-items-center bg-white/70 ${filas.length > 0 ? 'absolute inset-0' : 'py-12'}`}>
          <Spinner mensaje="Cargando…" />
        </div>
      )}
    </div>
  )
}
