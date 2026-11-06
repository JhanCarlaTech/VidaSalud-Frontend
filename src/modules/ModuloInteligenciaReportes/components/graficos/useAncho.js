import { useEffect, useRef, useState } from 'react'

/**
 * Ancho real de un contenedor, para dibujar el SVG a su tamaño en lugar de escalarlo
 * (así los textos del eje no se deforman). Empieza en 0: el contenedor no debe tomar
 * su ancho del SVG, o en pantallas angostas lo ensancharía y nunca se achicaría.
 * @returns {[import('react').RefObject<HTMLElement>, number]}
 */
export function useAncho(inicial = 0) {
  const referencia = useRef(null)
  const [ancho, setAncho] = useState(inicial)

  useEffect(() => {
    const elemento = referencia.current
    if (!elemento) return undefined

    const observador = new ResizeObserver(([entrada]) => setAncho(Math.floor(entrada.contentRect.width)))
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return [referencia, ancho]
}

/**
 * Máximo "redondo" del eje y su paso, con entre 2 y 5 marcas, eligiendo el que deja
 * menos espacio vacío: 37 → 40 (paso 10), 136 → 150 (paso 50).
 * @param {boolean} entero  Para conteos: el paso nunca es fraccionario.
 */
export function escalaLimpia(maximo, { entero = true } = {}) {
  if (!maximo || maximo <= 0) return { maximo: entero ? 4 : 1, paso: entero ? 1 : 0.25 }

  const opciones = [2, 3, 4, 5].map((marcas) => {
    const pasoCrudo = maximo / marcas
    const magnitud = 10 ** Math.floor(Math.log10(pasoCrudo))
    let paso = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitud).find((candidato) => candidato >= pasoCrudo)
    if (entero) paso = Math.max(1, Math.ceil(paso))
    return { maximo: paso * Math.ceil(maximo / paso), paso }
  })

  // El más ajustado; ante empate, el de más marcas (más referencias para leer).
  return opciones.reduce((mejor, opcion) => (opcion.maximo < mejor.maximo || (opcion.maximo === mejor.maximo && opcion.paso < mejor.paso) ? opcion : mejor))
}
