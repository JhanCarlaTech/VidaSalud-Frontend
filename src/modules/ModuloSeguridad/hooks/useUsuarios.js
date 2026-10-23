import { useCallback, useEffect, useState } from 'react'
import { listarUsuarios } from '../services/usuario.service'

/**
 * Listado paginado de usuarios que se vuelve a consultar cuando cambian los filtros.
 * Mientras llega la nueva respuesta se conservan las filas anteriores.
 * @param {{ buscar?: string, rol?: string, activo?: string, page?: number }} filtros
 */
export function useUsuarios({ buscar, rol, activo, page }) {
  // Incrementarlo fuerza una nueva consulta con los mismos filtros.
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ consulta: null, usuarios: [], meta: null, error: '' })

  // Identifica la consulta vigente; está "cargando" hasta que llega su respuesta.
  const consulta = JSON.stringify([buscar, rol, activo, page, version])

  useEffect(() => {
    let vigente = true

    listarUsuarios({ buscar, rol, activo, page })
      .then((datos) => vigente && setResultado({ consulta, usuarios: datos.items, meta: datos.meta, error: '' }))
      .catch((err) => vigente && setResultado((anterior) => ({ ...anterior, consulta, error: err.message })))

    // Descarta la respuesta si los filtros cambiaron antes de que llegara.
    return () => {
      vigente = false
    }
  }, [consulta, buscar, rol, activo, page])

  const recargar = useCallback(() => setVersion((actual) => actual + 1), [])

  return {
    usuarios: resultado.usuarios,
    meta: resultado.meta,
    error: resultado.error,
    cargando: resultado.consulta !== consulta,
    recargar,
  }
}
