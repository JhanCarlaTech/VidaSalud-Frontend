import { useAuth } from '../../modules/ModuloSeguridad/hooks/useAuth'
import { RUTAS } from '../utils/constants'
import { EstadoPage } from './EstadoPage'

export function NoEncontradaPage() {
  const { sesion } = useAuth()

  return (
    <EstadoPage
      codigo="404"
      titulo="Página no encontrada"
      descripcion="La dirección que busca no existe o fue movida."
      destino={sesion?.ruta_inicio ?? RUTAS.LOGIN}
      textoBoton="Ir al inicio"
    />
  )
}
