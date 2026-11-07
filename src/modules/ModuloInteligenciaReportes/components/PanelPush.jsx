import { Alert } from '../../../shared/components/ui/Alert'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { usePush } from '../hooks/usePush'

const DESCRIPCION = {
  activo: 'Este dispositivo recibe los avisos de sus citas, aunque la página esté cerrada.',
  inactivo: 'Reciba en este celular o computadora un aviso cuando se agende, cambie o se acerque su cita.',
  bloqueado:
    'Las notificaciones están bloqueadas para este sitio. Actívelas desde el candado junto a la dirección del navegador y recargue la página.',
  'no-soportado': 'Este navegador no admite notificaciones. Use Chrome, Edge, Firefox o Safari actualizado.',
  'no-disponible': 'Las notificaciones al dispositivo no están disponibles en este momento.',
}

function IconoCampana() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

/**
 * CU20 – Activar las notificaciones push en el dispositivo actual.
 * Cada dispositivo se activa por separado (celular, computadora…).
 */
export function PanelPush() {
  const push = usePush()
  if (push.estado === 'cargando') return null

  const descripcion = push.iosSinInstalar
    ? 'En iPhone: toque Compartir → "Agregar a pantalla de inicio", abra la app desde allí e ingrese a esta página para activar los avisos.'
    : DESCRIPCION[push.estado]

  return (
    <section
      aria-labelledby="titulo-push"
      className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-5 shadow-suave sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primario-suave text-primario">
          <IconoCampana />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id="titulo-push" className="flex flex-wrap items-center gap-2 text-base font-semibold">
            Avisos en este dispositivo
            {push.estado === 'activo' && <Badge variante="exito">Activados</Badge>}
            {push.estado === 'bloqueado' && <Badge variante="peligro">Bloqueados</Badge>}
          </h2>
          <p className="text-sm text-suave">{descripcion}</p>
          {push.mensaje && (
            <div className="mt-2">
              <Alert variante={push.mensaje.tipo === 'error' ? 'error' : 'info'}>{push.mensaje.texto}</Alert>
            </div>
          )}
        </div>
      </div>

      {push.estado === 'inactivo' && (
        <Button onClick={push.activar} cargando={push.ocupado} className="shrink-0">
          Activar avisos
        </Button>
      )}
      {push.estado === 'activo' && (
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variante="secundario" onClick={push.probar} disabled={push.ocupado}>
            Enviar prueba
          </Button>
          <Button variante="fantasma" onClick={push.desactivar} disabled={push.ocupado}>
            Desactivar
          </Button>
        </div>
      )}
    </section>
  )
}
