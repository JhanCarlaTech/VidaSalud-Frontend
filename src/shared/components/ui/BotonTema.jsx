import { useTema } from '../../hooks/useTema'

/** Alterna entre modo claro y oscuro. Muestra el ícono del modo al que se cambiará. */
export function BotonTema({ className = '' }) {
  const { tema, alternar } = useTema()
  const oscuro = tema === 'oscuro'
  const etiqueta = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={etiqueta}
      title={etiqueta}
      className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-borde bg-superficie text-suave transition-colors hover:bg-superficie-subtil hover:text-primario ${className}`}
    >
      {oscuro ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  )
}
