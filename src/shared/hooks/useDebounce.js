import { useEffect, useState } from 'react'

/**
 * Devuelve el valor recién cuando deja de cambiar durante `retardo` ms.
 * Útil para no consultar la API en cada tecla de una búsqueda.
 */
export function useDebounce(valor, retardo = 400) {
  const [valorDiferido, setValorDiferido] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setValorDiferido(valor), retardo)
    return () => clearTimeout(temporizador)
  }, [valor, retardo])

  return valorDiferido
}
