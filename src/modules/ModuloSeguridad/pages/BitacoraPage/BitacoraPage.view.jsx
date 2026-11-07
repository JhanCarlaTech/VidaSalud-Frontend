import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { formatearFechaHora } from '../../../../shared/utils/formatters'
import { DetalleEventoModal } from './components/DetalleEventoModal'
import { RANGOS_RAPIDOS, useBitacoraPage } from './BitacoraPage'

/** Eventos de seguridad que conviene distinguir a simple vista. */
const ACCIONES_ALERTA = ['LOGIN_FALLIDO', 'LOGIN_RECHAZADO']

const COLUMNAS = (verDetalle) => [
  {
    clave: 'fecha',
    titulo: 'Fecha y hora',
    className: 'whitespace-nowrap',
    render: (evento) => formatearFechaHora(evento.fecha),
  },
  {
    clave: 'usuario',
    titulo: 'Usuario',
    render: (evento) =>
      evento.usuario ? (
        <div className="flex flex-col">
          <span className="font-semibold">{evento.usuario.nombre_completo}</span>
          <span className="text-suave">{evento.usuario.correo}</span>
        </div>
      ) : (
        <div className="flex flex-col">
          <span className="text-suave italic">Sin usuario</span>
          {evento.correo_intento && <span className="text-suave">{evento.correo_intento}</span>}
        </div>
      ),
  },
  {
    clave: 'accion',
    titulo: 'Acción',
    render: (evento) => <Badge variante={ACCIONES_ALERTA.includes(evento.accion) ? 'solido' : 'neutro'}>{evento.accion_etiqueta}</Badge>,
  },
  { clave: 'tabla', titulo: 'Módulo', render: (evento) => evento.tabla_etiqueta },
  { clave: 'ip', titulo: 'IP', className: 'font-mono text-xs' },
  {
    clave: 'detalle',
    titulo: 'Detalle',
    className: 'text-right',
    render: (evento) => (
      <Button variante="secundario" tamano="sm" onClick={() => verDetalle(evento.id)} aria-label={`Ver detalle del evento ${evento.id}`}>
        Ver
      </Button>
    ),
  },
]

/**
 * CU06 – Consultar Bitácora de Auditoría.
 */
export function BitacoraPage() {
  const pagina = useBitacoraPage()
  const { filtros, meta } = pagina

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Bitácora de auditoría</h1>
          <p className="text-suave">Quién hizo qué, cuándo y desde dónde. Los registros no se pueden modificar ni eliminar.</p>
        </div>
        <Button variante="secundario" onClick={pagina.exportar} cargando={pagina.exportando} disabled={pagina.cargando || Boolean(pagina.errorRango)}>
          Exportar CSV
        </Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.errorExportacion && <Alert variante="error">{pagina.errorExportacion}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            etiqueta="Usuario"
            name="buscar"
            type="search"
            placeholder="Nombre, CI o correo"
            value={filtros.buscar}
            onChange={pagina.cambiarFiltro}
          />
          <Select
            etiqueta="Acción"
            name="accion"
            value={filtros.accion}
            onChange={pagina.cambiarFiltro}
            opciones={[{ valor: '', etiqueta: 'Todas' }, ...pagina.acciones]}
          />
          <Select
            etiqueta="Módulo"
            name="tabla"
            value={filtros.tabla}
            onChange={pagina.cambiarFiltro}
            opciones={[{ valor: '', etiqueta: 'Todos' }, ...pagina.tablas]}
          />
          <Input etiqueta="IP de origen" name="ip" placeholder="Ej.: 192.168." value={filtros.ip} onChange={pagina.cambiarFiltro} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] lg:items-end">
          <Input etiqueta="Desde" name="desde" type="date" value={filtros.desde} max={filtros.hasta || undefined} onChange={pagina.cambiarFiltro} />
          <Input
            etiqueta="Hasta"
            name="hasta"
            type="date"
            value={filtros.hasta}
            min={filtros.desde || undefined}
            onChange={pagina.cambiarFiltro}
            error={pagina.errorRango}
          />
          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1 lg:justify-end">
            {RANGOS_RAPIDOS.map((rango) => (
              <Button key={rango.dias} variante="secundario" tamano="sm" onClick={() => pagina.aplicarRango(rango.dias)}>
                {rango.etiqueta}
              </Button>
            ))}
            <Button variante="secundario" tamano="sm" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {meta && (
        <p className="text-sm text-suave" aria-live="polite">
          {meta.total === 1 ? '1 evento' : `${meta.total.toLocaleString('es-BO')} eventos`}
          {pagina.hayFiltros ? ' con los filtros aplicados.' : ' registrados.'}
        </p>
      )}

      <DataTable
        columnas={COLUMNAS(pagina.verDetalle)}
        filas={pagina.eventos}
        obtenerClave={(evento) => evento.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ningún evento coincide con los filtros.' : 'Aún no hay eventos registrados.'}
      />

      <Pagination meta={meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {pagina.idDetalle !== null && <DetalleEventoModal idEvento={pagina.idDetalle} onCerrar={pagina.cerrarDetalle} />}
    </section>
  )
}
