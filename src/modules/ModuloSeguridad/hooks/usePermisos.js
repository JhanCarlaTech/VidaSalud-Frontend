import { useEffect, useState } from 'react'
import { listarPermisos } from '../services/permiso.service'

/** Catálogo de permisos activos. Se consulta una sola vez. */
export function usePermisos() {
  const [permisos, setPermisos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true

    listarPermisos()
      .then((datos) => vigente && setPermisos(datos))
      .catch((err) => vigente && setError(err.message))

    return () => {
      vigente = false
    }
  }, [])

  return { permisos, error }
}
