import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Ejecuta una consulta asíncrona a la API y expone sus datos, error y estado de carga.
 * Se repite cuando cambia `clave` o al llamar a `recargar()`, y descarta las
 * respuestas que llegan después de que la consulta cambió.
 *
 * @param {() => Promise<any>} consultar
 * @param {string} [clave]  Valor que, al cambiar, vuelve a ejecutar la consulta.
 */
export function useConsulta(consultar, clave = '') {
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ consulta: null, datos: null, error: '' })
  // Siempre la función más reciente, sin volver a consultar en cada render.
  const funcion = useRef(consultar)

  useEffect(() => {
    funcion.current = consultar
  })

  const consulta = `${clave}|${version}`

  useEffect(() => {
    let vigente = true

    funcion
      .current()
      .then((datos) => vigente && setResultado({ consulta, datos, error: '' }))
      .catch((err) => vigente && setResultado((anterior) => ({ ...anterior, consulta, error: err.message })))

    return () => {
      vigente = false
    }
  }, [consulta])

  const recargar = useCallback(() => setVersion((actual) => actual + 1), [])

  return {
    datos: resultado.datos,
    error: resultado.error,
    cargando: resultado.consulta !== consulta,
    recargar,
  }
}
