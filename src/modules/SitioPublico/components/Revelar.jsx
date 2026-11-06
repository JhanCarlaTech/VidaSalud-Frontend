import { useEffect, useRef, useState } from 'react'

/**
 * Muestra su contenido con una transición suave cuando entra en pantalla.
 * Con "reducir movimiento" activado en el sistema aparece sin animación (ver index.css).
 * @param {number} [retraso]  Milisegundos de espera, para escalonar tarjetas.
 */
export function Revelar({ as: Etiqueta = 'div', retraso = 0, className = '', children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return undefined

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observador.observe(elemento)

    return () => observador.disconnect()
  }, [])

  return (
    <Etiqueta
      ref={ref}
      className={`revelar ${visible ? 'revelar-visible' : ''} ${className}`}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
      {...props}
    >
      {children}
    </Etiqueta>
  )
}
