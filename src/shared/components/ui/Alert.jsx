const VARIANTES = {
  info: 'border-primario bg-gris text-texto',
  error: 'border-peligro bg-peligro-fondo text-peligro',
}

/**
 * Mensaje destacado con borde lateral. Las alertas de error se anuncian
 * de inmediato a los lectores de pantalla.
 * @param {'error' | 'info'} variante
 */
export function Alert({ variante = 'info', children }) {
  return (
    <div
      role={variante === 'error' ? 'alert' : 'status'}
      className={`rounded-sm border-0 border-l-[3px] px-4 py-3 text-sm ${VARIANTES[variante]}`}
    >
      {children}
    </div>
  )
}
