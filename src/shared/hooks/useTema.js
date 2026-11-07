import { useContext } from 'react'
import { TemaContext } from '../../core/providers/temaContext'

/** @returns {{ tema: 'claro' | 'oscuro', alternar: () => void }} */
export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema debe usarse dentro de <TemaProvider>.')
  return contexto
}
