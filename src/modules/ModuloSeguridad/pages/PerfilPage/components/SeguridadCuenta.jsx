import { useState } from 'react'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Badge } from '../../../../../shared/components/ui/Badge'
import { Button } from '../../../../../shared/components/ui/Button'
import { ConfirmModal } from '../../../../../shared/components/ui/ConfirmModal'
import { Spinner } from '../../../../../shared/components/ui/Spinner'
import { useConsulta } from '../../../../../shared/hooks/useConsulta'
import { formatearFechaHora } from '../../../../../shared/utils/formatters'
import { cerrarOtrasSesiones, listarAccesos, listarSesiones } from '../../../services/perfil.service'

const ETIQUETA_ACCESO = {
  LOGIN: 'Inicio de sesión',
  LOGIN_FALLIDO: 'Intento fallido',
  LOGIN_RECHAZADO: 'Acceso rechazado',
  LOGOUT: 'Cierre de sesión',
}

/**
 * Sesiones abiertas y accesos recientes de la cuenta (CU05, flujo 5 / RN07).
 */
export function SeguridadCuenta({ onAviso }) {
  const sesiones = useConsulta(listarSesiones)
  const accesos = useConsulta(listarAccesos)
  const [confirmando, setConfirmando] = useState(false)

  const otrasSesiones = (sesiones.datos ?? []).filter((sesion) => !sesion.actual).length

  function alCerrarSesiones(respuesta) {
    setConfirmando(false)
    onAviso(respuesta.message)
    sesiones.recargar()
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Sesiones abiertas</h2>
            <p className="text-sm text-suave">Dispositivos donde su cuenta tiene una sesión activa.</p>
          </div>
          <Button variante="secundario" onClick={() => setConfirmando(true)} disabled={otrasSesiones === 0}>
            Cerrar las demás sesiones
          </Button>
        </div>

        {sesiones.error && <Alert variante="error">{sesiones.error}</Alert>}
        {sesiones.cargando && !sesiones.datos ? (
          <Spinner mensaje="Cargando sesiones…" />
        ) : (
          <ul className="flex flex-col divide-y divide-borde rounded-md border border-borde bg-white">
            {(sesiones.datos ?? []).map((sesion) => (
              <li key={`${sesion.ip}-${sesion.ultima_actividad}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {sesion.dispositivo}
                    {sesion.actual && <Badge variante="solido">Este dispositivo</Badge>}
                  </span>
                  <span className="text-xs text-suave">IP {sesion.ip}</span>
                </div>
                <span className="text-xs text-suave">Última actividad: {formatearFechaHora(sesion.ultima_actividad)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Accesos recientes</h2>
          <p className="text-sm text-suave">Últimos inicios de sesión de su cuenta. Si no reconoce alguno, cambie su contraseña.</p>
        </div>

        {accesos.error && <Alert variante="error">{accesos.error}</Alert>}
        {accesos.cargando && !accesos.datos ? (
          <Spinner mensaje="Cargando accesos…" />
        ) : (accesos.datos ?? []).length === 0 ? (
          <p className="text-sm text-suave">No hay accesos registrados.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-borde rounded-md border border-borde bg-white">
            {accesos.datos.map((acceso, indice) => (
              <li key={`${acceso.fecha}-${indice}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <Badge variante={acceso.accion === 'LOGIN' || acceso.accion === 'LOGOUT' ? 'neutro' : 'contorno'}>
                    {ETIQUETA_ACCESO[acceso.accion] ?? acceso.accion}
                  </Badge>
                  <span className="text-xs text-suave">IP {acceso.ip}</span>
                </span>
                <span className="text-xs text-suave">{formatearFechaHora(acceso.fecha)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {confirmando && (
        <ConfirmModal
          titulo="Cerrar las demás sesiones"
          textoConfirmar="Cerrar sesiones"
          onConfirmar={cerrarOtrasSesiones}
          onExito={alCerrarSesiones}
          onCerrar={() => setConfirmando(false)}
        >
          <p>
            Se cerrará su sesión en {otrasSesiones === 1 ? 'otro dispositivo' : `${otrasSesiones} dispositivos`}. Esta sesión
            seguirá abierta.
          </p>
        </ConfirmModal>
      )}
    </div>
  )
}
