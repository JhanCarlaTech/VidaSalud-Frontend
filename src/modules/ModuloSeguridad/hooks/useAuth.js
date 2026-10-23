import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/** Acceso al estado de autenticación. Debe usarse dentro de <AuthProvider>. */
export function useAuth() {
  const contexto = useContext(AuthContext)

  if (contexto === null) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }

  return contexto
}
