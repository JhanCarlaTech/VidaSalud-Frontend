import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { Toggle } from '../../../../shared/components/ui/Toggle'
import { RUTAS } from '../../../../shared/utils/constants'
import { formatearDia, formatearFechaHora } from '../../../../shared/utils/formatters'
import { PanelPush } from '../../components/PanelPush'
import { useMisNotificacionesPage } from './MisNotificacionesPage'

/**
 * CU20 – Bandeja de notificaciones del paciente.
 */
export function MisNotificacionesPage() {
  const pagina = useMisNotificacionesPage()

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Notificaciones</h1>
          <p className="text-suave">
            Avisos de sus citas y de la clínica. Elija si también los recibe por correo en{' '}
            <Link to={RUTAS.PERFIL} className="font-medium text-texto underline">
              Mi perfil
            </Link>
            .
          </p>
        </div>
        <Button variante="secundario" onClick={pagina.marcarTodas} cargando={pagina.marcando === 'todas'} disabled={pagina.noLeidas === 0}>
          Marcar todas como leídas
        </Button>
      </header>

      <PanelPush />

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="max-w-md">
        <Toggle
          etiqueta="Mostrar solo las no leídas"
          descripcion={pagina.noLeidas === 1 ? 'Tiene 1 notificación sin leer.' : `Tiene ${pagina.noLeidas} notificaciones sin leer.`}
          activo={pagina.soloNoLeidas}
          onCambiar={pagina.cambiarFiltro}
        />
      </div>

      {pagina.cargando && pagina.notificaciones.length === 0 && <Spinner mensaje="Cargando notificaciones…" />}

      {!pagina.cargando && pagina.notificaciones.length === 0 && (
        <p className="rounded-xl border border-borde bg-superficie px-4 py-12 text-center text-suave">
          {pagina.soloNoLeidas ? 'No tiene notificaciones sin leer.' : 'Aún no tiene notificaciones.'}
        </p>
      )}

      <ul className={`flex flex-col gap-3 ${pagina.cargando ? 'opacity-60' : ''}`}>
        {pagina.notificaciones.map((notificacion) => (
          <li
            key={notificacion.id}
            className={`flex flex-col gap-3 rounded-xl border bg-superficie p-4 sm:flex-row sm:items-start sm:justify-between ${notificacion.leida ? 'border-borde' : 'border-primario'}`}
          >
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-2">
                {!notificacion.leida && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-peligro" />}
                <span className={notificacion.leida ? 'font-medium' : 'font-semibold'}>{notificacion.titulo}</span>
                {!notificacion.leida && <span className="sr-only">(sin leer)</span>}
              </p>
              <p className="text-sm">{notificacion.mensaje}</p>
              <p className="text-xs text-suave">
                {formatearFechaHora(notificacion.fecha)}
                {notificacion.cita && (
                  <>
                    {' · '}Cita {notificacion.cita.codigo} del {formatearDia(notificacion.cita.fecha, { dateStyle: 'medium' })}, {notificacion.cita.hora}
                    {' · '}
                    <Link to={RUTAS.PACIENTE_CITAS} className="font-medium text-texto underline">
                      Ver mis citas
                    </Link>
                  </>
                )}
              </p>
            </div>
            {!notificacion.leida && (
              <Button variante="secundario" tamano="sm" onClick={() => pagina.marcar(notificacion.id)} cargando={pagina.marcando === notificacion.id} className="shrink-0">
                Marcar como leída
              </Button>
            )}
          </li>
        ))}
      </ul>

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />
    </section>
  )
}
