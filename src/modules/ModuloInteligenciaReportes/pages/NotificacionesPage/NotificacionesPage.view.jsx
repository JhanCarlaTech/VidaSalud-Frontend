import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { formatearFechaHora } from '../../../../shared/utils/formatters'
import { CORREO_REENVIABLE, ETIQUETA_CORREO, VARIANTE_CORREO } from '../../utils/notificaciones'
import { AvisoModal } from './components/AvisoModal'
import { useNotificacionesPage } from './NotificacionesPage'

const OPCIONES_CORREO = [{ valor: '', etiqueta: 'Todos' }, ...Object.entries(ETIQUETA_CORREO).map(([valor, etiqueta]) => ({ valor, etiqueta }))]

/**
 * CU20 – Gestionar Notificaciones y Recordatorios (Recepción y Administración).
 */
export function NotificacionesPage() {
  const pagina = useNotificacionesPage()
  const { filtros } = pagina

  const columnas = [
    { clave: 'fecha', titulo: 'Fecha', className: 'whitespace-nowrap', render: (n) => formatearFechaHora(n.fecha) },
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (n) => (
        <div className="flex flex-col">
          <span className="font-semibold">{n.paciente.nombre_completo}</span>
          <span className="text-suave">{n.paciente.codigo}</span>
        </div>
      ),
    },
    {
      clave: 'mensaje',
      titulo: 'Notificación',
      render: (n) => (
        <div className="flex max-w-md flex-col gap-0.5">
          <span className="font-medium">
            {n.titulo}
            {n.cita && <span className="font-normal text-suave"> · {n.cita.codigo}</span>}
          </span>
          <span className="line-clamp-2 text-suave">{n.mensaje}</span>
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Entrega',
      render: (n) => (
        <div className="flex flex-col items-start gap-1">
          <Badge variante={VARIANTE_CORREO[n.estado_correo]}>{ETIQUETA_CORREO[n.estado_correo]}</Badge>
          <span className="text-xs text-suave">{n.leida ? 'Leída' : 'Sin leer'}</span>
        </div>
      ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (n) =>
        CORREO_REENVIABLE.includes(n.estado_correo) ? (
          <Button variante="secundario" tamano="sm" onClick={() => pagina.reenviar(n.id)} cargando={pagina.procesando === n.id}>
            Reenviar correo
          </Button>
        ) : null,
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Notificaciones</h1>
          <p className="text-suave">
            Avisos de citas y recordatorios enviados a los pacientes. Los recordatorios salen solos cada 15 minutos según la anticipación que elige cada paciente.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variante="secundario" onClick={pagina.enviarRecordatorios} cargando={pagina.procesando === 'recordatorios'}>
            Enviar recordatorios ahora
          </Button>
          <Button onClick={pagina.abrirAviso}>Nuevo aviso</Button>
        </div>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input etiqueta="Paciente" name="buscar" type="search" placeholder="Nombre, CI o código" value={filtros.buscar} onChange={pagina.cambiarFiltro} />
          <Select etiqueta="Tipo" name="tipo" value={filtros.tipo} onChange={pagina.cambiarFiltro} opciones={[{ valor: '', etiqueta: 'Todos' }, ...pagina.tipos]} />
          <Select etiqueta="Correo" name="estado_correo" value={filtros.estado_correo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_CORREO} />
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Input etiqueta="Desde" name="desde" type="date" value={filtros.desde} onChange={pagina.cambiarFiltro} />
          <Input etiqueta="Hasta" name="hasta" type="date" value={filtros.hasta} min={filtros.desde || undefined} onChange={pagina.cambiarFiltro} error={pagina.errorRango} />
          <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
            Limpiar
          </Button>
        </div>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.notificaciones}
        obtenerClave={(n) => n.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ninguna notificación coincide con los filtros.' : 'Aún no se enviaron notificaciones.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {pagina.modalAviso && <AvisoModal onCerrar={pagina.cerrarAviso} onEnviado={pagina.finalizarAviso} />}
    </section>
  )
}
