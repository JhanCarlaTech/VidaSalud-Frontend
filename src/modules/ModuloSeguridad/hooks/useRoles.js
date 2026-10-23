import { useCallback, useEffect, useState } from 'react'
import { listarRoles } from '../services/rol.service'

/**
 * Roles del sistema con sus permisos y conteo de usuarios.
 * @param {{ soloActivos?: boolean }} opciones  soloActivos: los asignables en CU02.
 */
export function useRoles({ soloActivos = false } = {}) {
  // Incrementarlo fuerza una nueva consulta.
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ consulta: null, roles: [], error: '' })

  // Identifica la consulta vigente; está "cargando" hasta que llega su respuesta.
  const consulta = `${soloActivos}-${version}`

  useEffect(() => {
    let vigente = true

    listarRoles({ activos: soloActivos })
      .then((roles) => vigente && setResultado({ consulta, roles, error: '' }))
      .catch((err) => vigente && setResultado((anterior) => ({ ...anterior, consulta, error: err.message })))

    return () => {
      vigente = false
    }
  }, [consulta, soloActivos])

  const recargar = useCallback(() => setVersion((actual) => actual + 1), [])

  return {
    roles: resultado.roles,
    error: resultado.error,
    cargando: resultado.consulta !== consulta,
    recargar,
  }
}
