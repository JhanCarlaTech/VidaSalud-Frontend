import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { listarEspecialidadesPublicas } from '../../../ModuloOperacionCitas/services/reservaPublica.service'
import { EncabezadoSitio } from '../../components/EncabezadoSitio'
import { PieSitio } from '../../components/PieSitio'
import { SeccionContacto } from '../../components/SeccionContacto'
import { SeccionEspecialidades } from '../../components/SeccionEspecialidades'
import { SeccionNosotros } from '../../components/SeccionNosotros'
import { SeccionPortada } from '../../components/SeccionPortada'
import { SeccionReserva } from '../../reserva/SeccionReserva'
import { useReservaEnLinea } from '../../reserva/useReservaEnLinea'

/**
 * Página principal pública de la clínica. La ven visitantes y usuarios con
 * sesión (el encabezado ofrece volver al panel). Su sección central permite
 * reservar y pagar una cita desde internet.
 */
export function LandingPage() {
  const { datos, cargando, error } = useConsulta(listarEspecialidadesPublicas)
  const especialidades = datos ?? []
  const reserva = useReservaEnLinea()


  return (
    <div className="min-h-full bg-fondo">
      <a
        href="#agendar"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primario focus:px-4 focus:py-2 focus:text-sobre-primario"
      >
        Ir a agendar cita
      </a>
      <EncabezadoSitio />
      <main>
        <SeccionPortada totalEspecialidades={especialidades.length} onAgendar={() => reserva.abrir()} />
        {/* "Reservar" en una tarjeta abre el asistente con esa especialidad elegida */}
        <SeccionEspecialidades especialidades={especialidades} cargando={cargando} error={error} onReservar={reserva.abrir} />
        <SeccionNosotros />
        <SeccionReserva reserva={reserva} especialidades={especialidades} />
        <SeccionContacto />
      </main>
      <PieSitio />
    </div>
  )
}
