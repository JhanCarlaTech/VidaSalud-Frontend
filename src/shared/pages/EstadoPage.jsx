import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

/** Plantilla de página de estado (sin acceso, no encontrada, etc.). */
export function EstadoPage({ codigo, titulo, descripcion, destino, textoBoton }) {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <Logo />
      <p className="mt-8 text-6xl font-bold tracking-tighter">{codigo}</p>
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <p className="text-suave">{descripcion}</p>
      <Button className="mt-4" onClick={() => navigate(destino, { replace: true })}>
        {textoBoton}
      </Button>
    </main>
  )
}
