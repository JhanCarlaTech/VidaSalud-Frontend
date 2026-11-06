import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal'
import { Select } from '../../../../shared/components/ui/Select'
import { formatearTamano } from '../../../../shared/utils/archivos'
import { RUTAS } from '../../../../shared/utils/constants'
import { ResultadoImportacion } from './components/ResultadoImportacion'
import { VistaPreviaImportacion } from './components/VistaPreviaImportacion'
import { TIPOS_CARGA, useCargaLotesPage } from './CargaLotesPage'

const OPCIONES_TIPO = Object.entries(TIPOS_CARGA).map(([valor, { etiqueta }]) => ({ valor, etiqueta }))

/** Lista de columnas de la plantilla como etiquetas de código. */
function Columnas({ titulo, columnas }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wider text-suave uppercase">{titulo}</span>
      <div className="flex flex-wrap gap-1.5">
        {columnas.map((columna) => (
          <code key={columna} className="rounded-sm border border-borde bg-superficie px-2 py-0.5 font-mono text-xs">
            {columna}
          </code>
        ))}
      </div>
    </div>
  )
}

/** Paso numerado del flujo. */
function Paso({ numero, titulo, children }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-borde bg-white p-6">
      <h2 className="flex items-center gap-3 text-lg font-semibold">
        <span className="grid size-7 place-items-center rounded-full bg-primario text-sm text-white">{numero}</span>
        {titulo}
      </h2>
      {children}
    </section>
  )
}

/**
 * CU04 – Cargar Usuarios por Lotes.
 */
export function CargaLotesPage() {
  const pagina = useCargaLotesPage()
  const { tipo, configuracion, archivo, vistaPrevia, resultado } = pagina
  const idArchivo = useId()

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link to={RUTAS.ADMIN_USUARIOS} className="text-sm text-suave hover:text-texto">
          ← Volver a usuarios
        </Link>
        <h1 className="text-3xl font-semibold">Carga por lotes</h1>
        <p className="text-suave">Registre varias cuentas a la vez desde un archivo CSV. Se crean todas o ninguna.</p>
      </header>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      {resultado ? (
        <ResultadoImportacion resultado={resultado} onNuevaCarga={pagina.nuevaCarga} />
      ) : (
        <>
          <Paso numero={1} titulo="Elija el tipo de cuentas y descargue la plantilla">
            <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr] md:items-end">
              <Select etiqueta="Tipo de carga" name="tipo" value={tipo} onChange={pagina.cambiarTipo} opciones={OPCIONES_TIPO} disabled={pagina.validando} />
              <div>
                <Button variante="secundario" onClick={pagina.bajarPlantilla} cargando={pagina.descargando}>
                  Descargar plantilla
                </Button>
              </div>
            </div>
            <p className="text-sm text-suave">{configuracion.descripcion}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Columnas titulo="Columnas obligatorias" columnas={configuracion.obligatorias} />
              <Columnas titulo="Columnas opcionales" columnas={configuracion.opcionales} />
            </div>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-suave">
              {tipo === 'personal' && <li>Varios roles se separan con «|», por ejemplo: Administrador|Recepcionista.</li>}
              {tipo === 'pacientes' && <li>La fecha de nacimiento puede ir como AAAA-MM-DD o DD/MM/AAAA. El contacto de emergencia va completo o vacío.</li>}
              <li>Si deja vacía la contraseña, el sistema genera una temporal y se la muestra al terminar.</li>
              <li>Hasta 200 filas por archivo. En Excel, guarde con «Guardar como» → «CSV».</li>
            </ul>
          </Paso>

          <Paso numero={2} titulo="Seleccione el archivo y valídelo">
            <div className="flex flex-col gap-2">
              <label htmlFor={idArchivo} className="text-sm font-medium">
                Archivo CSV
              </label>
              <div
                className={`flex flex-col gap-3 rounded-sm border border-dashed px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  pagina.errorArchivo ? 'border-peligro' : 'border-borde'
                }`}
              >
                <input
                  key={pagina.claveSelector}
                  id={idArchivo}
                  type="file"
                  accept=".csv,.txt,text/csv"
                  onChange={pagina.seleccionarArchivo}
                  disabled={pagina.validando}
                  aria-invalid={Boolean(pagina.errorArchivo)}
                  aria-describedby={pagina.errorArchivo ? `${idArchivo}-error` : undefined}
                  className="text-sm file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-primario file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gris"
                />
                {archivo && <span className="text-sm text-suave">{formatearTamano(archivo.size)}</span>}
              </div>
              {pagina.errorArchivo && (
                <p id={`${idArchivo}-error`} className="text-xs text-peligro">
                  {pagina.errorArchivo}
                </p>
              )}
            </div>
            <div>
              <Button onClick={pagina.validar} cargando={pagina.validando} disabled={!archivo || Boolean(pagina.errorArchivo)}>
                Validar archivo
              </Button>
            </div>
          </Paso>

          {vistaPrevia && (
            <Paso numero={3} titulo="Revise la vista previa e importe">
              {vistaPrevia.resumen.con_errores > 0 ? (
                <Alert variante="error">
                  Corrija las filas marcadas en su archivo y vuelva a validarlo. No se creará ninguna cuenta mientras haya errores.
                </Alert>
              ) : (
                <Alert>Todas las filas son válidas. Aún no se ha guardado nada: confirme para crear las cuentas.</Alert>
              )}

              <VistaPreviaImportacion tipo={tipo} vistaPrevia={vistaPrevia} />

              <div className="flex justify-end">
                <Button onClick={pagina.abrirConfirmacion} disabled={!pagina.puedeImportar}>
                  Importar {vistaPrevia.resumen.validas} {vistaPrevia.resumen.validas === 1 ? 'cuenta' : 'cuentas'}
                </Button>
              </div>
            </Paso>
          )}
        </>
      )}

      {pagina.confirmando && vistaPrevia && (
        <ConfirmModal
          titulo="Confirmar importación"
          textoConfirmar="Importar"
          onConfirmar={pagina.importar}
          onExito={pagina.finalizarImportacion}
          onCerrar={pagina.cerrarConfirmacion}
        >
          <p>
            Se crearán <strong>{vistaPrevia.resumen.validas}</strong> cuentas de {configuracion.etiqueta.toLowerCase()} a partir de{' '}
            <strong>{archivo?.name}</strong>.
          </p>
          <p className="text-suave">El archivo se vuelve a validar al importar; si alguna fila falla, no se crea ninguna cuenta.</p>
        </ConfirmModal>
      )}
    </section>
  )
}
