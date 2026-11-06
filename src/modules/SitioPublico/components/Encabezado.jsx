/** Título de una sección de la página principal, con antetítulo y bajada. */
export function EncabezadoSeccion({ antetitulo, titulo, descripcion, centrado = false }) {
  return (
    <header className={`flex max-w-2xl flex-col gap-3 ${centrado ? 'mx-auto items-center text-center' : ''}`}>
      <span className="text-xs font-semibold tracking-[0.2em] text-suave uppercase">{antetitulo}</span>
      <h2 className="text-3xl font-bold sm:text-4xl">{titulo}</h2>
      {descripcion && <p className="text-suave">{descripcion}</p>}
    </header>
  )
}
