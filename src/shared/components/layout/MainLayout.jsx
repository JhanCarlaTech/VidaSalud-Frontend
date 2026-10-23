import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

/** Estructura de los paneles autenticados: menú lateral + contenido de la ruta. */
export function MainLayout() {
  return (
    <div className="grid min-h-full md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="min-w-0 px-4 py-6 md:p-12">
        <Outlet />
      </main>
    </div>
  )
}
