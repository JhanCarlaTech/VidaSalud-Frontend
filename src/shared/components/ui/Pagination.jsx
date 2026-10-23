import { Button } from './Button'

/**
 * Paginación simple "Anterior / Siguiente" con el resumen de registros.
 * @param {{ pagina_actual: number, ultima_pagina: number, por_pagina: number, total: number }} meta
 */
export function Pagination({ meta, onCambiarPagina, deshabilitado = false }) {
  if (!meta || meta.total === 0) return null

  const desde = (meta.pagina_actual - 1) * meta.por_pagina + 1
  const hasta = Math.min(meta.pagina_actual * meta.por_pagina, meta.total)

  return (
    <nav aria-label="Paginación" className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-suave">
        Mostrando {desde}–{hasta} de {meta.total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variante="secundario"
          onClick={() => onCambiarPagina(meta.pagina_actual - 1)}
          disabled={deshabilitado || meta.pagina_actual <= 1}
        >
          Anterior
        </Button>
        <span className="px-2 text-sm text-suave">
          {meta.pagina_actual} / {meta.ultima_pagina}
        </span>
        <Button
          variante="secundario"
          onClick={() => onCambiarPagina(meta.pagina_actual + 1)}
          disabled={deshabilitado || meta.pagina_actual >= meta.ultima_pagina}
        >
          Siguiente
        </Button>
      </div>
    </nav>
  )
}
