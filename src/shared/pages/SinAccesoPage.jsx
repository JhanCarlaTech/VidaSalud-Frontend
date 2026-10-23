import { useAuth } from '../../modules/ModuloSeguridad/hooks/useAuth'
import { RUTAS } from '../utils/constants'
import { EstadoPage } from './EstadoPage'

/** E7: el usuario autenticado intentó entrar a un panel de otro rol. */
export function SinAccesoPage() {
  const { sesion } = useAuth()

  return (
    <EstadoPage
      codigo="403"
      titulo="Acceso restringido"
      descripcion="No tiene permisos para ver esta sección."
      destino={sesion?.ruta_inicio ?? RUTAS.LOGIN}
      textoBoton="Volver a mi inicio"
    />
  )
}
