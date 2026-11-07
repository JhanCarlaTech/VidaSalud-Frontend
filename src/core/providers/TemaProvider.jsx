import { useCallback, useEffect, useMemo, useState } from 'react'
import { CLAVE_TEMA, TemaContext } from './temaContext'

const consultaOscuro = () => window.matchMedia('(prefers-color-scheme: dark)')

function leerPreferencia() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    return guardado === 'claro' || guardado === 'oscuro' ? guardado : null
  } catch {
    return null // Navegación privada o almacenamiento bloqueado: se sigue al sistema.
  }
}

/** Aplica el tema a <html> con una transición de color breve (salvo movimiento reducido). */
function aplicar(tema, animar) {
  const raiz = document.documentElement
  if (animar) {
    raiz.classList.add('cambiando-tema')
    window.setTimeout(() => raiz.classList.remove('cambiando-tema'), 250)
  }
  raiz.classList.toggle('dark', tema === 'oscuro')
}

/**
 * Modo claro (blanco y azul) / oscuro (negro y azul).
 * Sin elección guardada se sigue la preferencia del sistema operativo, también si cambia.
 */
export function TemaProvider({ children }) {
  const [preferencia, setPreferencia] = useState(leerPreferencia)
  const [sistemaOscuro, setSistemaOscuro] = useState(() => consultaOscuro().matches)

  const tema = preferencia ?? (sistemaOscuro ? 'oscuro' : 'claro')

  useEffect(() => {
    const consulta = consultaOscuro()
    const alCambiar = (evento) => {
      // Sin elección guardada, el tema sigue al sistema; la clase se aplica antes de re-renderizar.
      if (!leerPreferencia()) aplicar(evento.matches ? 'oscuro' : 'claro', true)
      setSistemaOscuro(evento.matches)
    }
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  useEffect(() => {
    aplicar(tema, document.documentElement.classList.contains('dark') !== (tema === 'oscuro'))
  }, [tema])

  const alternar = useCallback(() => {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro'
    // La clase cambia antes del render: quien lea los tokens (p. ej., Stripe) ve el tema nuevo.
    aplicar(nuevo, true)
    setPreferencia(nuevo)
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo)
    } catch {
      // Sin almacenamiento la elección dura hasta recargar.
    }
  }, [tema])

  const valor = useMemo(() => ({ tema, alternar }), [tema, alternar])

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>
}
