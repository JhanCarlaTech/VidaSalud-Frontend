import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { EVENTO_SESION_EXPIRADA } from '../../../core/api/http-client'
import { cerrarSesion, iniciarSesion, obtenerSesion, registrarPaciente } from '../services/auth.service'

/** Estado de autenticación compartido. Se consume con el hook useAuth(). */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

/**
 * Mantiene la sesión del usuario (CU01): la recupera al cargar la página,
 * expone login/logout y la limpia cuando el servidor indica que expiró.
 */
export function AuthProvider({ children }) {
  // sesion = { usuario, roles, rol_principal, permisos, ruta_inicio } | null
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Recupera la sesión existente (cookie) al recargar la página.
  useEffect(() => {
    let vigente = true

    obtenerSesion()
      .then((datos) => vigente && setSesion(datos))
      .catch(() => vigente && setSesion(null))
      .finally(() => vigente && setCargando(false))

    return () => {
      vigente = false
    }
  }, [])

  // Cualquier 401 en la API significa que la sesión ya no es válida (E6).
  useEffect(() => {
    const limpiarSesion = () => setSesion(null)
    window.addEventListener(EVENTO_SESION_EXPIRADA, limpiarSesion)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, limpiarSesion)
  }, [])

  const login = useCallback(async (credenciales) => {
    const datos = await iniciarSesion(credenciales)
    setSesion(datos)
    return datos
  }, [])

  /** Autorregistro de paciente (CU11): crea la cuenta y deja la sesión iniciada. */
  const registrarse = useCallback(async (datos) => {
    const respuesta = await registrarPaciente(datos)
    setSesion(respuesta.data)
    return respuesta
  }, [])

  const logout = useCallback(async () => {
    try {
      await cerrarSesion()
    } finally {
      setSesion(null)
    }
  }, [])

  /** Vuelve a leer roles y permisos, por ejemplo tras modificar el propio rol (CU03). */
  const refrescarSesion = useCallback(async () => {
    try {
      setSesion(await obtenerSesion())
    } catch {
      setSesion(null)
    }
  }, [])

  const valor = useMemo(
    () => ({
      sesion,
      usuario: sesion?.usuario ?? null,
      cargando,
      login,
      registrarse,
      logout,
      refrescarSesion,
      /** ¿Tiene alguno de los roles indicados? */
      tieneRol: (...roles) => roles.some((rol) => sesion?.roles.includes(rol)),
      /** ¿Tiene el permiso indicado? Ej.: canAccess('citas_programar') */
      canAccess: (accion) => sesion?.permisos.includes(accion) ?? false,
    }),
    [sesion, cargando, login, registrarse, logout, refrescarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
