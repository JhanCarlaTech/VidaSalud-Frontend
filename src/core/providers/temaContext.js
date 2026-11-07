import { createContext } from 'react'

/** Clave en localStorage. index.html la lee antes de React para no destellar en blanco. */
export const CLAVE_TEMA = 'vs-tema'

/** @type {import('react').Context<{ tema: 'claro' | 'oscuro', alternar: () => void } | null>} */
export const TemaContext = createContext(null)
