import { useEffect, useState } from 'react'

/**
 * Mensaje de resultado (por ejemplo, "Usuario registrado correctamente")
 * que desaparece solo después de `duracion` ms.
 * @returns {[string, (mensaje: string) => void]}
 */
export function useAviso(duracion = 4000) {
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(''), duracion)
    return () => clearTimeout(temporizador)
  }, [aviso, duracion])

  return [aviso, setAviso]
}
