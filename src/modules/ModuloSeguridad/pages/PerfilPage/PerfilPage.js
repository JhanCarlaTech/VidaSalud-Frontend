import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useAuth } from '../../hooks/useAuth'
import { obtenerPerfil } from '../../services/perfil.service'

export const PESTANAS = [
  { clave: 'datos', etiqueta: 'Datos personales' },
  { clave: 'seguridad', etiqueta: 'Seguridad' },
  { clave: 'notificaciones', etiqueta: 'Notificaciones' },
]

/**
 * Lógica de la página de perfil (CU05): carga del perfil, pestaña activa y avisos.
 */
export function usePerfilPage() {
  const { refrescarSesion } = useAuth()
  const [pestana, setPestana] = useState(PESTANAS[0].clave)
  const [aviso, setAviso] = useAviso()
  const { datos, cargando, error, recargar } = useConsulta(obtenerPerfil)

  /** Tras guardar datos personales: se recarga el perfil y el nombre que muestra el menú. */
  function alGuardarDatos(mensaje) {
    setAviso(mensaje)
    recargar()
    refrescarSesion()
  }

  function alGuardarPreferencias(mensaje) {
    setAviso(mensaje)
    recargar()
  }

  return {
    pestana,
    cambiarPestana: setPestana,
    perfil: datos,
    cargando,
    error,
    aviso,
    mostrarAviso: setAviso,
    alGuardarDatos,
    alGuardarPreferencias,
  }
}
